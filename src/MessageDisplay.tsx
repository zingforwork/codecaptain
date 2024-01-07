import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  return (
    <div>
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  );
}

export default MessageDisplay;
