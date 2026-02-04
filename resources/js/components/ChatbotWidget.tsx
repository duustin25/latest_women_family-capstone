import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import Chatbot from '@/components/Chatbot';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-4 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 scale-95"
            >
                {/* Simplified wrapper without extra rounded corners */}
                <div className="w-[calc(100vw-3rem)] sm:w-[400px] shadow-2xl rounded-sm overflow-hidden border border-[#6b21a8]">
                    <Chatbot className="h-[450px] w-full border-0 rounded-none shadow-none" />
                </div>
            </Transition>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 border-2 border-white",
                    isOpen
                        ? "bg-slate-800 hover:bg-slate-900 text-white rotate-90"
                        : "bg-[#6b21a8] hover:bg-[#581c87] text-white hover:scale-105"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
            </Button>
        </div>
    );
}
