import React, { useState, useCallback } from 'react';
import { Message, MessageRole } from './types';
import { sendMessage } from './services/geminiService';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import { BotIcon } from './components/icons';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: MessageRole.MODEL, content: 'Dobrý den! Jsem Váš AI asistent pro ArtStyl.cz. S čím Vám dnes mohu pomoci? Mohu čerpat informace z webu, abych odpověděl na vaše dotazy týkající se umění a designu.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { role: MessageRole.USER, content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { text, sourceUrls } = await sendMessage(userMessage.content);
            const modelMessage: Message = { role: MessageRole.MODEL, content: text, sourceUrls };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Failed to get response:", error);
            const errorMessage: Message = { 
                role: MessageRole.MODEL, 
                content: "Omlouvám se, došlo k problému s připojením. Zkuste to prosím znovu." 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-3">
                    <BotIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">ArtStyl.cz AI asistent</h1>
                </div>
            </header>
            <main className="flex-grow flex flex-col min-h-0">
                <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 md:max-w-4xl w-full mx-auto md:my-4 rounded-lg shadow-xl overflow-hidden">
                    <ChatHistory messages={messages} isLoading={isLoading} />
                    <ChatInput 
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;