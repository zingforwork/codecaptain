import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import rangeParser from 'parse-numeric-range'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import IconButton from '@mui/material/IconButton'
import FileCopyIcon from '@mui/icons-material/FileCopy'

interface MessageDisplayProps {
  message: string
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  const [isCopied, setCopied] = useState(false)

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const codeContent = String(children).replace(/\n$/, '')
      const hasMeta = node?.data?.meta

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/
          const metadata = node.data.meta?.replace(/\s/g, '')
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)?.[1] || '0'
            : '0'
          const highlightLines = rangeParser(strlineNumbers)
          const highlight = highlightLines
          const data: string | null = highlight.includes(applyHighlights)
            ? 'highlight'
            : null
          return { data }
        } else {
          return {}
        }
      }

      const handleCopy = () => {
        navigator.clipboard.writeText(codeContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }

      return !inline && match ? (
        <div style={{ position: 'relative', backgroundColor: '#f7f7f7', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              backgroundColor: '#e0ffff',
              textAlign: 'center',
              padding: '4px 0',
              borderBottom: '1px solid #ccc',
            }}
          >
            {match[1]}
          </div>
          <IconButton
            onClick={handleCopy}
            size='small'
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 1,
              backgroundColor: '#e0e0e0',
            }}
          >
          <FileCopyIcon />
          </IconButton>
          {isCopied && (
            <div style={{ position: 'absolute', top: '8px', right: '40px', zIndex: 1, backgroundColor: '#fff' }}>
              Copied!
            </div>
          )}
          <br/>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag='div'
            className='codeStyle'
            showLineNumbers={true}
            wrapLines={hasMeta}
            useInlineStyles={true}
            lineProps={applyHighlights}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '600px', margin: 'auto', marginTop: '16px' }}>
      <Typography variant='body1' component='div'>
        <ReactMarkdown components={components}>{message}</ReactMarkdown>
      </Typography>
    </Paper>
  )
}

export default MessageDisplay
