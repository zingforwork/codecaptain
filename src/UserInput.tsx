import React, { useState, ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import { AIParams, InputOutputs, Suggestion } from '@service/ai/Definitions'
import AiService from '@service/ai/AiService'

interface UserInputProps {
  onMessageSubmit: (userData: {
    instruction: string
    functionName: string
    programmingLanguage: string
    inputOutputList: InputOutputs
  }) => void
}

const UserInput: React.FC<UserInputProps> = ({ onMessageSubmit }) => {
  const [userData, setUserData] = useState<{
    instruction: string
    functionName: string
    programmingLanguage: string
    inputOutputList: InputOutputs
  }>({
    instruction: '',
    functionName: '',
    programmingLanguage: '',
    inputOutputList: [{ input: '', output: '' }],
  })

  const [showSuggestionProgrammingLanguages, setShowSuggestionProgrammingLanguages] = useState(false)
  const [showSuggestionFunctionNames, setShowSuggestionFunctionNames] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    setUserData((prevData) => ({
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
    }

    if (suggestion === Suggestion.programmingLanguage && suggestionProgrammingLanguages.length === 0) {
      const result = await AiService.call(params) as string[]

      setSuggestionProgrammingLanguages(result)
    }

    if (suggestion === Suggestion.functionName && suggestionFunctionNames.length === 0) {
      const result = await AiService.call(params) as string[]

      setSuggestionFunctionNames(result)
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
      functionName,
    }))
    setShowSuggestionFunctionNames(false)
  }

  const handleInputOutputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: 'input' | 'output') => {
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
      inputOutputList: [...prevData.inputOutputList, { input: '', output: '' }],
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
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <TextField
        label='Instruction'
        fullWidth
        value={userData.instruction}
        onChange={(e) => handleInputChange(e, 'instruction')}
        onFocus={() => {
          setShowSuggestionProgrammingLanguages(false)
          setShowSuggestionFunctionNames(false)
        }}
      />

      <br/>
      <br/>
      <TextField
        label='Programming Language'
        fullWidth
        value={userData.programmingLanguage}
        onChange={(e) => handleInputChange(e, 'programmingLanguage')}
        onFocus={() => {
          setShowSuggestionProgrammingLanguages(true)
          setShowSuggestionFunctionNames(false)
          suggestionButtons(Suggestion.programmingLanguage)
        }}
      />
      {showSuggestionProgrammingLanguages && (
        <Stack direction='row' spacing={1}>
          {suggestionProgrammingLanguages.map((option) => (
            <Chip
              key={option}
              label={option}
              onClick={() => replaceProgrammingLanguage(option)}
            />
          ))}
        </Stack>
      )}

      <br/>
      <br/>
      <TextField
        label='Function Name'
        fullWidth
        value={userData.functionName}
        onChange={(e) => handleInputChange(e, 'functionName')}
        onFocus={() => {
          setShowSuggestionProgrammingLanguages(false)
          setShowSuggestionFunctionNames(true)
          suggestionButtons(Suggestion.functionName)
        }}
      />
      {showSuggestionFunctionNames && (
        <Stack direction='row' spacing={1}>
          {suggestionFunctionNames.map((option) => (
            <Chip
              key={option}
              label={option}
              onClick={() => replaceFunctionName(option)}
            />
          ))}
        </Stack>
      )}

      <br/>
      <br/>
      <Stack spacing={2}>
        {userData.inputOutputList.map((io, index) => (
          <div key={index}>
            <TextField
              label='Input'
              value={io.input}
              onChange={(e) => handleInputOutputChange(e, index, 'input')}
              onFocus={() => {
                setShowSuggestionProgrammingLanguages(false)
                setShowSuggestionFunctionNames(false)
              }}
            />
            <TextField
              label='Output'
              value={io.output}
              onChange={(e) => handleInputOutputChange(e, index, 'output')}
              onFocus={() => {
                setShowSuggestionProgrammingLanguages(false)
                setShowSuggestionFunctionNames(false)
              }}
            />
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                handleRemoveInputOutput(index)
                setShowSuggestionProgrammingLanguages(false)
                setShowSuggestionFunctionNames(false)
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </Stack>

      <br/>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => {
          handleAddInputOutput()
          setShowSuggestionProgrammingLanguages(false)
          setShowSuggestionFunctionNames(false)
        }}
      >
        Add Input/Output
      </Button>

      <br/>
      <br/>
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          handleSubmit()
          setShowSuggestionProgrammingLanguages(false)
          setShowSuggestionFunctionNames(false)
        }}
      >
        Let's code
      </Button>
    </Paper>
  )
}

export default UserInput
