export enum Suggestion {
  programmingLanguage = 'programming language',
  functionName = 'algorithm or function'
}

export type InputOutputs = {
  input: string,
  output: string
}[]

export type AIParams = {
  suggestion?: Suggestion
  instruction?: string
  functionName?: string
  programmingLanguage?: string
  inputOutputList: InputOutputs
}

export type AIResult = string[] | ReadableStream<string>

export type InputText = string | undefined
