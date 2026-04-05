import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { 
  Send, User, Bot, Sparkles, Activity, ShieldCheck, Info, 
  Plus, History, Trash2, Utensils, Dumbbell, TrendingUp, HelpCircle 
} from 'lucide-react';

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 15); // Adjust speed here
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text]);

  return <span>{displayedText}</span>;
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(null);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const scrollRef = useRef(null);

  // Quick Action Buttons
  const quickActions = [
    { label: "Today's Diet", icon: <Utensils size={14} />, query: "What should I eat today?" },
    { label: "Today's Workout", icon: <Dumbbell size={14} />, query: "What's my workout?" },
    { label: "My Progress", icon: <TrendingUp size={14} />, query: "Am I improving?" },
    { label: "Health Tips", icon: <HelpCircle size={14} />, query: "Give me some tips" }
  ];

  const fetchHistory = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const [histRes, profRes] = await Promise.all([
        axios.get('http://localhost:5000/chat/history', config),
        axios.get('http://localhost:5000/user/profile', config)
      ]);
      // Mark existing history as already 'completed' (not streaming)
      setMessages(histRes.data.map((m, i) => ({ ...m, id: i, completed: true })));
      setProfile(profRes.data);
    } catch (error) {
      console.error('Error fetching chat context', error);
      setMessages([{ id: 'init', role: 'assistant', message: "Hey! I'm your AI Coach. Ready to reach your goals?", completed: true }]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const query = forcedQuery || input;
    if (!query.trim()) return;

    const userMsgId = Date.now();
    const userMsg = { id: userMsgId, role: 'user', message: query, completed: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.post('http://localhost:5000/chat', { 
        message: query,
        context: {
          weight: profile?.weight,
          bmi: profile?.bmi,
          goal: profile?.goal,
          status: profile?.bmi < 18.5 ? 'underweight' : profile?.bmi < 25 ? 'healthy' : profile?.bmi < 30 ? 'overweight' : 'obese',
          age: profile?.age,
          gender: profile?.gender,
          target_calories: profile?.target_calories
        }
      }, config);
      
      const botMsgId = Date.now() + 1;
      const botMsg = { id: botMsgId, role: 'assistant', message: res.data.reply, completed: false };
      setMessages(prev => [...prev, botMsg]);
      setStreamingMessageId(botMsgId);
    } catch (error) {
      const errMsgId = Date.now() + 2;
      const errMsg = { id: errMsgId, role: 'assistant', message: "Communication error! Please retry, Athlete.", completed: true };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const markCompleted = (id) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, completed: true } : m));
      setStreamingMessageId(null);
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear all AI coaching data for this session?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete('http://localhost:5000/chat/history', config);
      setMessages([{ id: Date.now(), role: 'assistant', message: "History reset. New protocol initiated. How can I help?", completed: true }]);
    } catch (error) {
      console.error('Error clearing history', error);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">
      {/* Sidebar Panel */}
      <GlassCard className="hidden lg:flex w-72 flex-col p-6 bg-surface-low/20 border-outline-variant/5">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display font-black text-[10px] text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <History size={14} /> Session Logs
          </h2>
          <button onClick={clearHistory} className="text-zinc-500 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 text-xs">
          {messages.filter(m => m.role === 'user').slice(-10).map((msg) => (
            <button 
              key={msg.id} 
              onClick={() => setInput(msg.message)}
              className="w-full text-left p-4 rounded-2xl bg-surface-high/10 border border-white/5 hover:bg-surface-high/30 transition-all truncate text-zinc-500 font-medium hover:text-white"
            >
              {msg.message}
            </button>
          ))}
          {messages.filter(m => m.role === 'user').length === 0 && (
            <div className="text-center py-20 text-zinc-700 font-display text-[10px] uppercase tracking-widest">No Active Telemetry</div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
           <div className="flex items-center gap-3 p-4 rounded-3xl bg-secondary/5 border border-secondary/10">
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                 <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Biometric Lock</p>
                <span className="text-[8px] font-bold text-zinc-500 uppercase">Encrypted Session</span>
              </div>
           </div>
        </div>
      </GlassCard>

      {/* Main Chat Interface */}
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-outline-variant/10 bg-surface-low/10 shadow-2xl">
        
        {/* Quick Action Header */}
        <div className="p-4 bg-surface-high/40 border-b border-white/5 flex flex-wrap gap-3 z-10">
           {quickActions.map((action, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(null, action.query)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-900 text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:bg-primary hover:text-zinc-900 transition-all border border-white/5 shadow-md active:scale-95"
              >
                {action.icon} {action.label}
              </button>
           ))}
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 scroll-smooth custom-scrollbar">
           {messages.map((m) => (
              <div key={m.id} className={`flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-700`}>
                 <div className={`p-3.5 rounded-2xl h-fit shrink-0 shadow-lg ${
                    m.role === 'user' 
                    ? 'bg-secondary/20 text-secondary border border-secondary/20' 
                    : 'bg-primary/20 text-primary border border-primary/20 animate-pulse'
                 }`}>
                    {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                 </div>
                 <div className={`max-w-[85%] md:max-w-[75%] p-7 rounded-[40px] shadow-2xl leading-relaxed text-[15px] font-medium tracking-tight ${
                    m.role === 'user' 
                    ? 'bg-zinc-800/90 text-white rounded-tr-none border border-white/10' 
                    : 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 rounded-tl-none border border-primary/20 border-l-4 border-l-primary'
                 }`}>
                    {m.role === 'assistant' && !m.completed && m.id === streamingMessageId ? (
                        <TypewriterText text={m.message} onComplete={() => markCompleted(m.id)} />
                    ) : (
                        m.message
                    )}
                 </div>
              </div>
           ))}
           {isTyping && (
             <div className="flex gap-5">
                <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/10 animate-spin transition-all duration-[3000ms]">
                   <Activity size={24} />
                </div>
                <div className="bg-surface-high/40 px-8 py-5 rounded-[40px] rounded-tl-none flex items-center gap-2 border border-white/10">
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:200ms]" />
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:400ms]" />
                </div>
             </div>
           )}
        </div>

        {/* Suggestion & Input Area */}
        <div className="p-8 md:p-12 bg-zinc-950/40 border-t border-white/10 backdrop-blur-xl">
           {/* Chips */}
           <div className="flex flex-wrap gap-3 mb-8 ml-4">
              {["Weight plateau?", "Intermittent Fasting?", "Muscle soreness?", "Supplements?"].map(chip => (
                <button 
                  key={chip}
                  onClick={() => handleSend(null, chip)}
                  className="px-5 py-2 rounded-full bg-surface-high/30 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-primary/20 hover:text-white transition-all active:scale-95"
                >
                  {chip}
                </button>
              ))}
           </div>

           <form onSubmit={handleSend} className="relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Submit health query to Neural Intelligence..."
                className="w-full bg-zinc-900/60 border border-white/10 rounded-[45px] px-10 py-6 pr-24 text-white font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all placeholder:text-zinc-700 shadow-3xl text-lg"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping || streamingMessageId}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-primary text-background rounded-[30px] hover:scale-110 active:scale-90 transition-all shadow-glow shadow-primary disabled:opacity-30 disabled:scale-100"
              >
                 <Send size={24} />
              </button>
           </form>
           <div className="flex justify-center gap-10 mt-6 text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">
              <span>Real-Time Engine</span>
              <span>•</span>
              <span>Biometric-Synced</span>
              <span>•</span>
              <span>Expert Protocol</span>
           </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Chat;
