import AiService from '@service/ai/AiService'
import { AIParams, InputOutputs, Suggestion } from '@service/ai/Definitions'
import React, { useState, ChangeEvent } from 'react'

interface UserInputProps {
  onMessageSubmit: (userData: { instruction: string, functionName: string, programmingLanguage: string, inputOutputList: InputOutputs }) => void
}

const UserInput: React.FC<UserInputProps> = ({ onMessageSubmit }) => {
  const [userData, setUserData] = useState<{ instruction: string, functionName: string, programmingLanguage: string, inputOutputList: InputOutputs }>({
    instruction: '',
    functionName: '',
    programmingLanguage: '',
    inputOutputList: [{ input: '', output: '' }]
  })

  const [showSuggestionProgrammingLanguages, setShowSuggestionProgrammingLanguages] = useState(false);
  const [showSuggestionFunctionNames, setShowSuggestionFunctionNames] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setUserData(prevData => ({
      ...prevData,
      [fieldName]: e.target.value,
    }))

    if (fieldName !== 'programmingLanguage') {
      setSuggestionProgrammingLanguages([])
    }

    if (fieldName !== 'functionName') {
      setSuggestionFunctionNames([])
    }
  }

  const [suggestionProgrammingLanguages, setSuggestionProgrammingLanguages] = useState<string[]>([])
  const [suggestionFunctionNames, setSuggestionFunctionNames] = useState<string[]>([])

  const suggestionButtons = async (suggestion: Suggestion) => {
    const params: AIParams = {
      suggestion: suggestion,
      instruction: userData.instruction,
      functionName: userData.functionName,
      programmingLanguage: userData.programmingLanguage,
      inputOutputList: userData.inputOutputList,
    };

    if (suggestion === Suggestion.programmingLanguage 
      && suggestionProgrammingLanguages.length === 0) {
      const result = await AiService.call(params) as string[]

      for (const text of result) {
        setSuggestionProgrammingLanguages((prevData) => [...prevData, text])
      }
    }

    if (suggestion === Suggestion.functionName 
      && suggestionFunctionNames.length === 0) {
      const result = await AiService.call(params) as string[]

      for (const text of result) {
        setSuggestionFunctionNames((prevData) => [...prevData, text])
      }
    }
  }

  const replaceProgrammingLanguage = (programmingLanguage: string) => {
    setUserData((prevData) => ({
      ...prevData,
      programmingLanguage,
    }))
    setShowSuggestionProgrammingLanguages(false)
  }

  const replaceFunctionName = (functionName: string) => {
    setUserData((prevData) => ({
      ...prevData,
      functionName
    }))
    setShowSuggestionFunctionNames(false)
  }

  const handleInputOutputChange = (e: ChangeEvent<HTMLInputElement>, index: number, field: 'input' | 'output') => {
    const updatedList = [...userData.inputOutputList]
  
    if (updatedList[index]) {
      updatedList[index]![field] = e.target.value
  
      setUserData((prevData) => ({
        ...prevData,
        inputOutputList: updatedList,
      }))
    }
  }

  const handleAddInputOutput = () => {
    setUserData((prevData) => ({
      ...prevData,
      inputOutputList: [...prevData.inputOutputList, { input: '', output: '' }]
    }))
  }

  const handleRemoveInputOutput = (index: number) => {
    const updatedList = [...userData.inputOutputList]
    updatedList.splice(index, 1)

    setUserData((prevData) => ({
      ...prevData,
      inputOutputList: updatedList,
    }))
  }

  const handleSubmit = () => {
    onMessageSubmit(userData)
  }

  return (
    <div>
      <label htmlFor='instruction'>Instruction:</label>
      <br/>
      <input 
        type='text' 
        id='instruction' 
        value={userData.instruction} 
        onChange={(e) => handleInputChange(e, 'instruction')} 
        onFocus={() => { 
          setShowSuggestionProgrammingLanguages(false)
          setShowSuggestionFunctionNames(false)
        }}
      />

      <br/>

      <label htmlFor='programmingLanguage'>Programming Language:</label>
      <br/>
      <input 
        type='text' 
        id='programmingLanguage' 
        value={userData.programmingLanguage} 
        onChange={(e) => handleInputChange(e, 'programmingLanguage')} 
        onFocus={() => { 
          setShowSuggestionProgrammingLanguages(true)
          setShowSuggestionFunctionNames(false)
          suggestionButtons(Suggestion.programmingLanguage)
        }}
      />

      {showSuggestionProgrammingLanguages && (
        suggestionProgrammingLanguages.map((programmingLanguage) => (
          <button type='button' onClick={() => replaceProgrammingLanguage(programmingLanguage)}>
            {programmingLanguage}
          </button>
        ))
      )}

      <br/>

      <label htmlFor='functionName'>Function Name:</label>
      <br/>
      <input
        type='text'
        id='functionName'
        value={userData.functionName}
        onChange={(e) => handleInputChange(e, 'functionName')}
        onFocus={() => {
          setShowSuggestionProgrammingLanguages(false)
          setShowSuggestionFunctionNames(true)
          suggestionButtons(Suggestion.functionName)
        }}
      />

      {showSuggestionFunctionNames && (
        suggestionFunctionNames.map((functionName) => (
          <button type='button' onClick={() => replaceFunctionName(functionName)}>
            {functionName}
          </button>
        ))
      )}

      <br/>

      <label>Input/Output List:</label>
      {userData.inputOutputList.map((io, index) => (
        <div key={index}>
          <input
            type='text'
            value={io.input}
            onChange={(e) => handleInputOutputChange(e, index, 'input')}
            onFocus={() => {
              setShowSuggestionProgrammingLanguages(false)
              setShowSuggestionFunctionNames(false)
            }}
          />
          <input
            type='text'
            value={io.output}
            onChange={(e) => handleInputOutputChange(e, index, 'output')}
            onFocus={() => {
              setShowSuggestionProgrammingLanguages(false)
              setShowSuggestionFunctionNames(false)
            }}
          />
          <button type='button' onClick={() => {
            handleRemoveInputOutput(index)

            setShowSuggestionProgrammingLanguages(false)
            setShowSuggestionFunctionNames(false)
          }}>
            Remove
          </button>
        </div>
      ))}
      <button type='button' onClick={() => { 
        handleAddInputOutput()
        setShowSuggestionProgrammingLanguages(false)
        setShowSuggestionFunctionNames(false)
      }}>
        Add Input/Output
      </button>

      <br/>
      <br/>

      <button onClick={() => {
        handleSubmit()
        setShowSuggestionProgrammingLanguages(false)
        setShowSuggestionFunctionNames(false)
      }}>
        Let's code
      </button>
    </div>
  )
}

export default UserInput
