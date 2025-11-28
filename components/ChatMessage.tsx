import React from 'react';
import { Message, MessageRole } from '../types';
import { UserIcon, BotIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const messageClasses = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
  
  const Icon = isUser ? UserIcon : BotIcon;
  const iconOrder = isUser ? 'order-2' : 'order-1';
  const messageOrder = isUser ? 'order-1 mr-2 sm:mr-3' : 'order-2 ml-2 sm:ml-3';

  return (
    <div className={`mb-4 w-full ${wrapperClasses}`}>
        <div className="flex items-start max-w-xl lg:max-w-2xl">
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-gray-600'} ${iconOrder}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div className={`px-4 py-3 rounded-lg shadow-md ${messageClasses} ${messageOrder}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.sourceUrls && message.sourceUrls.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-300">
                    <p className="font-semibold mb-1">Zdroje:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {message.sourceUrls.map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-200 dark:text-blue-300 hover:underline"
                          >
                            {source.title || new URL(source.uri).hostname}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ChatMessage;