import { AIParams, AIResult } from '@service/ai/Definitions'
import AiAdapter from '@service/ai/AiAdapter'

async function call(params: AIParams): Promise<AIResult> {
  return params.suggestion !== undefined 
    ? AiAdapter.choices(params)
    : AiAdapter.text(params)
}

const AiService = {
  call
}

export default AiService