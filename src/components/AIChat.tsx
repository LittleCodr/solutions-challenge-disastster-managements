import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader, X, Minimize2, Maximize2 } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import { generateChatResponse } from '../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PRESET_PROMPTS = [
  {
    title: "Current Situation Overview",
    prompt: "Give me a summary of all active disasters and their current status"
  },
  {
    title: "Resource Analysis",
    prompt: "What is the current status of our resources and where are they deployed?"
  },
  {
    title: "Team Deployment Status",
    prompt: "Show me the status of all emergency response teams"
  },
  {
    title: "Critical Alerts",
    prompt: "What are the most critical alerts right now?"
  }
];

interface AIChatProps {
  onClose?: () => void;
}

export default function AIChat({ onClose }: AIChatProps) {
  const { disasters, resources, teams, alerts } = useDisasterStore();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! I'm your AI assistant. I can help you analyze disasters, check resource status, and provide real-time insights. How can I help you today?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsMinimized(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSend = async (promptText: string = input) => {
    if (!promptText.trim() && !input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: promptText || input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateChatResponse({
        prompt: promptText || input,
        context: {
          disasters,
          resources,
          teams,
          alerts
        }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="glass rounded-xl p-4 flex items-center space-x-3 hover:bg-white/5 transition-colors"
      >
        <Bot className="w-6 h-6 text-blue-400" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          <p className="text-sm text-gray-400">Click to expand</p>
        </div>
        <Maximize2 className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <div 
      ref={chatRef}
      className="glass rounded-xl overflow-hidden flex flex-col h-[600px] sm:h-[500px] md:h-[600px] w-full sm:max-w-md md:max-w-lg lg:max-w-xl"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="p-4 border-b border-white/10 overflow-x-auto">
        <div className="flex gap-2">
          {PRESET_PROMPTS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleSend(preset.prompt)}
              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-all hover-lift whitespace-nowrap"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500/20 text-blue-100'
                  : 'glass text-gray-200'
              }`}
            >
              <p className="whitespace-pre-line text-sm sm:text-base">{message.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass rounded-lg p-3 flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-gray-300">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about the current situation..."
            className="flex-1 bg-black/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}