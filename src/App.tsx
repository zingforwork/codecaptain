import AiService from '@service/ai/AiService'
import { AIParams, InputOutputs } from '@service/ai/Definitions'
import React, { useState } from 'react'
import MessageDisplay from '@src/MessageDisplay'
import UserInput from '@src/UserInput'

const App: React.FC = () => {
  const [message, setMessages] = useState<string>('')

  const handleUserMessage = async (userData: { 
    instruction: string, 
    functionName: string, 
    programmingLanguage: string, 
    inputOutputList: InputOutputs }) => {
    const params: AIParams = { 
      instruction: userData.instruction, 
      functionName: userData.functionName, 
      programmingLanguage: userData.programmingLanguage,
      inputOutputList: userData.inputOutputList
    }
    
    const result = await AiService.call(params) as ReadableStream<string>
    const reader = result.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        setMessages(prevMessages => prevMessages + value)
      }
    } finally {
      reader.releaseLock();
    }
  }

  return (
    <div>
      <UserInput onMessageSubmit={handleUserMessage} />
      <MessageDisplay message={message} />
    </div>
  )
}

export default App
