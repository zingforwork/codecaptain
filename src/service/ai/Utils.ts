import { AIParams, InputOutputs, InputText } from '@service/ai/Definitions'

function isFilledInput(input: InputText): boolean {
  return input !== undefined 
  && isFilledText(input)
}

function isFilledList(list: InputOutputs): boolean {
  return list.length > 0
  && list.some(item => 
    isFilledText(item.input)
    || isFilledText(item.output))
}

function isFilledText(text: string): boolean {
  return text.trim().length > 0
}

function isFilled(params: AIParams): boolean {
  return isFilledInput(params.instruction) 
  || isFilledInput(params.functionName)
  || isFilledInput(params.programmingLanguage)
  || isFilledList(params.inputOutputList)
}

const Utils = {
  isFilledInput,
  isFilledList,
  isFilledText,
  isFilled
}

export default Utils