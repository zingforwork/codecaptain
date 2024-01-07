import OpenAI from 'openai'
import { OpenAIResponse, OpenaiRequest } from './Definitions'

const apiKey = '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'
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

async function call(request: OpenaiRequest): Promise<OpenAIResponse> {
  return openai.chat.completions.create({...request})
}

const OpenaiApi = {
  call
}

export default OpenaiApi