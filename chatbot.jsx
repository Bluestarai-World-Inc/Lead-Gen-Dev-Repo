import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react';

export default function ChatWidget({ config, botName, primaryColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: config.start.text, id: 'start' }
  ]);
  const [currentStep, setCurrentStep] = useState('start');
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen]);

  const handleOptionClick = (option) => {
    const userMsg = { sender: 'user', text: option.label };
    const nextStepKey = option.next;
    const nextBotMsgObj = config[nextStepKey];

    setChatHistory(prev => [...prev, userMsg, { sender: 'bot', text: nextBotMsgObj.text, id: nextStepKey }]);
    setCurrentStep(nextStepKey);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = { sender: 'user', text: inputText };
    const currentStepObj = config[currentStep];
    const nextStepKey = currentStepObj.next;
    const nextBotMsgObj = config[nextStepKey];

    setChatHistory(prev => [...prev, userMsg, { sender: 'bot', text: nextBotMsgObj.text, id: nextStepKey }]);
    setCurrentStep(nextStepKey);
    setInputText("");
  };

  return (
    <>
      {/* 1. The Chat Window */}
      {isOpen && (
        <div 
          style={{ position: 'fixed', bottom: '100px', right: '24px', zIndex: 9999 }}
          className="w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white rounded-full"><MessageSquare size={16} className="text-gray-800" /></div>
              <span className="font-bold tracking-wide">{botName}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gray-700 p-1 rounded transition"><Minimize2 size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                  msg.sender === 'user' ? `${primaryColor} text-white rounded-br-none` : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Controls */}
          <div className="p-4 bg-white border-t border-gray-200">
            {config[currentStep]?.options ? (
              <div className="flex flex-wrap gap-2">
                {config[currentStep].options.map((opt, i) => (
                  <button key={i} onClick={() => handleOptionClick(opt)} className="text-xs px-3 py-2 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 transition font-medium">{opt.label}</button>
                ))}
              </div>
            ) : config[currentStep]?.input ? (
              <form onSubmit={handleInputSubmit} className="flex gap-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type message..." className="flex-1 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-indigo-500" />
                <button type="submit" className={`${primaryColor} text-white p-2 rounded hover:opacity-90`}><Send size={16} /></button>
              </form>
            ) : null}
          </div>
        </div>
      )}

      {/* 2. The Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
        className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-105 ${isOpen ? 'bg-gray-800 rotate-90' : primaryColor} text-white`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </>
  );
}