import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyToClipboard from 'react-copy-to-clipboard';

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  const [isCopied, setCopied] = useState(false);

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');

      const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };

      return !inline && match ? (
        <div>
          <CopyToClipboard text={codeContent} onCopy={handleCopy}>
            <button>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</button>
          </CopyToClipboard>
          <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
            {codeContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div>
      <ReactMarkdown components={components}>{message}</ReactMarkdown>
    </div>
  );
};

export default MessageDisplay;
