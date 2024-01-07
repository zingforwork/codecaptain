import { Messages, OpenaiRequest, ResponseType, Role } from '@api/openai/Definitions'
import { ChatCompletion, ChatCompletionChunk } from 'openai/resources'
import { AIParams, AIResult, InputOutputs, InputText, Suggestion } from '@service/ai/Definitions'
import OpenaiApi from '@api/openai/OpenaiApi'
import Utils from '@service/ai/Utils'
import { Stream } from 'openai/streaming'

const programmingLanguageMessages = (programmingLanguage: InputText): Messages =>
  Utils.isFilledInput(programmingLanguage)
    ? []
    : [
      {
        role: Role.assistant,
        content: 'Which preferred programming language'
      },
      {
        role: Role.user,
        content: programmingLanguage!
      }
    ]

const functionNameMessages = (functionName: InputText): Messages =>
  !Utils.isFilledInput(functionName)
    ? []
    : [
      {
        role: Role.assistant,
        content: 'Which preferred function name'
      },
      {
        role: Role.user,
        content: functionName!
      }
    ]

const instructionMessages = (instruction: InputText): Messages =>
  !Utils.isFilledInput(instruction)
    ? []
    : [
      {
        role: Role.assistant,
        content: 'Do you have some part of code and/or instruction ?'
      },
      {
        role: Role.user,
        content: instruction!
      }
    ]

const inputOutputMessages = (inputOutputList: InputOutputs): Messages =>
  inputOutputList.length === 0
    ? []
    : [
      {
        role: Role.assistant,
        content: 'Provide me sample input and output'
      },
    ].concat(inputOutputList.flatMap((item, index) => {
      const messages: Messages = []
      const number = index + 1

      if (Utils.isFilledText(item.input)) {
        messages.push({
          role: Role.user,
          content: `input${number}: ${item.input}`
        })
      }

      if (Utils.isFilledText(item.output)) {
        messages.push({
          role: Role.user,
          content: `output${number}: ${item.output}`
        })
      }

      return messages
    }))

function choiceRequest(params: AIParams): OpenaiRequest {
  const suggestion: Suggestion = params.suggestion!

  const jsonSchema = '```json{ \'list\': [item1, item2, ...] }```'
  const itemSize = '1-3'

  const choicesMessages: Messages = [
    {
      role: Role.system,
      content: 'You are a helpful assistant designed to output JSON array of string.'
    },
    {
      role: Role.assistant,
      content: `json schema is ${jsonSchema} must have key \'list\'`
    },
    {
      role: Role.user,
      content: `Suggest the \'${suggestion}\' name to solve problem expected ${itemSize} names`
    }
  ]

  const choicesFormatMessages: Messages = [
    {
      role: Role.assistant,
      content: `Sure I will suggest you list of \'${suggestion}\' with json format ${jsonSchema}`
    }
  ]

  return {
    model: ResponseType.choices,
    messages: choicesMessages.concat(
      instructionMessages(params.instruction),
      inputOutputMessages(params.inputOutputList),
      choicesFormatMessages
    ),
    stream: false,
    response_format: { type: 'json_object' }
  }
}

async function choices(params: AIParams): Promise<AIResult> {
  const response = await OpenaiApi.call(choiceRequest(params)) as ChatCompletion

  const data = response.choices[0]!.message.content

  console.log(response)

  const result = data === null
    ? []
    : JSON.parse(data).list

  console.log(result)

  return result
}

function textRequest(params: AIParams): OpenaiRequest {
  const textMessages: Messages = [
    {
      role: Role.user,
      content: `Code completion to solve problem`
    }
  ]

  return {
    model: ResponseType.text,
    messages: textMessages.concat(
      programmingLanguageMessages(params.programmingLanguage),
      instructionMessages(params.instruction),
      inputOutputMessages(params.inputOutputList),
      functionNameMessages(params.functionName)
    ),
    stream: true
  }
}

async function text(params: AIParams): Promise<AIResult> {
  const response = await OpenaiApi.call(textRequest(params)) as Stream<ChatCompletionChunk>

  const transformStream = new TransformStream<Uint8Array, string>({
    async transform(chunk, controller) {     
      const data = JSON.parse(new TextDecoder().decode(chunk)) as ChatCompletionChunk
      
      controller.enqueue(data.choices[0]?.delta?.content || '')
    },
  })

  const result = response.toReadableStream().pipeThrough(transformStream)

  return result
}

const AiAdapter = {
  choices,
  text
}

export default AiAdapter