import { ChatCompletion, ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources'
import { Stream } from 'openai/streaming'

export type OpenaiRequest = {
  model: string,
  messages: Array<ChatCompletionMessageParam>
  stream: boolean,
  response_format?: object
}

export type OpenAIResponse = Stream<ChatCompletionChunk> | ChatCompletion

export enum Role {
  system = 'system',
  assistant = 'assistant',
  user = 'user'
}

export enum ResponseType {
  choices = 'gpt-3.5-turbo-1106',
  text = 'gpt-3.5-turbo'
}

export type Messages = {
  role: Role,
  content: string
}[]