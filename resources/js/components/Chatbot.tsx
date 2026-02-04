import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { route } from 'ziggy-js';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

const SUGGESTIONS = [
    "How do I file a VAWC case?",
    "View emergency hotlines",
    "List of accredited orgs",
    "What is RA 9262?"
];

// Simple text indicator instead of bouncing dots
const TypingIndicator = () => (
    <div className="text-xs text-slate-500 italic pl-1">
        The Sentinel is typing...
    </div>
);

export default function Chatbot({ className }: { className?: string }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Good day. I am The Sentinel, the official automated assistant for the Women & Family Protection Management System. How may I assist you?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e?: React.FormEvent, overrideInput?: string) => {
        if (e) e.preventDefault();

        const textToSend = overrideInput || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(route('chat.send'), { message: userMessage.content });

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.response || "I apologize, but I couldn't process that request.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "System Error: Unable to connect to server. Please try again or contact support.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className={cn("w-full max-w-2xl mx-auto h-[600px] flex flex-col border-2 border-[#6b21a8] bg-white rounded-sm shadow-none", className)}>
            {/* Strict Header */}
            <CardHeader className="border-b border-[#6b21a8] bg-[#6b21a8] p-4 shrink-0 rounded-t-sm rounded-b-none">
                <CardTitle className="flex items-center gap-3 text-lg text-white font-bold uppercase tracking-wider">
                    <div className="bg-white p-1 rounded-none border border-yellow-400">
                        <Bot className="h-5 w-5 text-[#6b21a8]" />
                    </div>
                    <div className="flex flex-col">
                        <span>The Sentinel</span>
                        <span className="text-[10px] uppercase font-medium text-yellow-400 opacity-100">
                            Automated Assistance Unit
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>

            {/* Chat Area */}
            <CardContent className="flex-1 overflow-hidden p-0 relative flex flex-col bg-slate-50">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full gap-3 max-w-[90%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <Avatar className={cn(
                                "h-8 w-8 shrink-0 border border-slate-300 rounded-sm",
                                msg.role === 'assistant'
                                    ? "bg-white"
                                    : "bg-slate-200"
                            )}>
                                <AvatarFallback className="rounded-sm font-bold text-xs">
                                    {msg.role === 'assistant' ? <Bot size={16} className="text-[#6b21a8]" /> : <User size={16} className="text-slate-700" />}
                                </AvatarFallback>
                            </Avatar>

                            <div className={cn(
                                "p-3 rounded-sm text-sm border",
                                msg.role === 'user'
                                    ? "bg-[#6b21a8] text-white border-[#581c87]"
                                    : "bg-white text-slate-800 border-slate-200"
                            )}>
                                <div className="font-bold text-[10px] uppercase mb-1 opacity-80 tracking-wide">
                                    {msg.role === 'user' ? 'Citizen' : 'System Bot'}
                                </div>
                                {msg.content}
                                <div className={cn(
                                    "text-[9px] mt-2 font-mono text-right",
                                    msg.role === 'user' ? "text-purple-200" : "text-slate-400"
                                )}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex w-full gap-3 mr-auto max-w-[90%]">
                            <TypingIndicator />
                        </div>
                    )}
                </div>

                {/* Suggestions Area - Squared Chips */}
                {!isLoading && messages.length < 4 && (
                    <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 pb-3 bg-slate-50 border-t border-slate-200 pt-3">
                        {SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(undefined, suggestion)}
                                className="whitespace-nowrap px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-white text-[#6b21a8] border border-[#6b21a8] rounded-sm hover:bg-[#6b21a8] hover:text-white transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Input Area */}
            <CardFooter className="p-3 bg-white border-t border-[#6b21a8] shrink-0">
                <form onSubmit={(e) => handleSend(e)} className="flex w-full gap-2 items-end">
                    <Input
                        placeholder="Type your query here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 min-h-[44px] max-h-32 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus-visible:ring-[#6b21a8] focus-visible:border-[#6b21a8] rounded-sm py-3"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="h-[44px] w-[44px] bg-[#6b21a8] hover:bg-[#581c87] text-white rounded-sm shrink-0"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
