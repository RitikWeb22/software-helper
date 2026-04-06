import { useState } from 'react';
import { Send, Zap } from 'lucide-react';

interface UserInputBarProps {
  onSend: (problem: string) => void;
  disabled?: boolean;
}

export function UserInputBar({ onSend, disabled }: UserInputBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 pointer-events-none">
      <div className="glass-panel p-2 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-2 pointer-events-auto group focus-within:border-primary/40 transition-colors">
        
        <div className="pl-4 pr-2 text-primary opacity-70 group-focus-within:opacity-100 transition-opacity">
          <Zap size={20} />
        </div>
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Describe your design problem..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-3 text-lg font-medium"
          disabled={disabled}
        />

        <button 
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="bg-gradient-to-br from-primary to-[#00eefc] disabled:opacity-50 text-black p-3 px-6 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_16px_rgba(143,245,255,0.4)] hover:shadow-[0_0_24px_rgba(143,245,255,0.6)] cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Send</span>
          <Send size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
