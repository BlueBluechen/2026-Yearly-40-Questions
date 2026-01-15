import React, { useRef, useState, useEffect } from 'react';
import { AIReportData } from '../types';
import html2canvas from 'html2canvas';
import { Download, MousePointer2, Camera, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportCardsProps {
  data: AIReportData;
}

type CardStyle = 'sticky' | 'ticket' | 'letter' | 'polaroid';

interface PrintedCard {
  id: string;
  style: CardStyle;
  title: string;
  content: string;
  footer: string;
  rotation: number;
  zIndex: number;
  xOffset: number;
  yOffset: number;
}

// Polaroid Sound Effect
const playPolaroidSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const t = ctx.currentTime;

  // 1. Shutter Click (Mechanical Snap)
  const snapOsc = ctx.createOscillator();
  const snapGain = ctx.createGain();
  snapOsc.type = 'square';
  snapOsc.frequency.setValueAtTime(800, t);
  snapOsc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
  snapGain.gain.setValueAtTime(0.3, t);
  snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
  snapOsc.connect(snapGain);
  snapGain.connect(ctx.destination);
  snapOsc.start(t);
  snapOsc.stop(t + 0.1);

  // 2. High Frequency Whir (Motor Eject)
  const motorOsc = ctx.createOscillator();
  const motorGain = ctx.createGain();
  motorOsc.type = 'sawtooth';
  motorOsc.frequency.setValueAtTime(400, t + 0.1);
  motorOsc.frequency.linearRampToValueAtTime(600, t + 1.2); // Pitch goes up slightly
  
  const motorFilter = ctx.createBiquadFilter();
  motorFilter.type = 'lowpass';
  motorFilter.frequency.value = 1500;

  motorGain.gain.setValueAtTime(0, t + 0.1);
  motorGain.gain.linearRampToValueAtTime(0.15, t + 0.2);
  motorGain.gain.linearRampToValueAtTime(0.15, t + 1.0);
  motorGain.gain.linearRampToValueAtTime(0, t + 1.2);

  motorOsc.connect(motorFilter);
  motorFilter.connect(motorGain);
  motorGain.connect(ctx.destination);
  motorOsc.start(t + 0.1);
  motorOsc.stop(t + 1.3);
};

const ReportCards: React.FC<ReportCardsProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Prepare the queue of cards
  const [queue, setQueue] = useState<PrintedCard[]>([]);
  const [onBoardCards, setOnBoardCards] = useState<PrintedCard[]>([]);
  const [isDeveloping, setIsDeveloping] = useState(false);
  
  useEffect(() => {
    // Define styles sequence: Sticky -> Ticket -> Letter -> Polaroid -> Repeat
    const styles: CardStyle[] = ['sticky', 'ticket', 'letter', 'polaroid'];

    const initCards: PrintedCard[] = [
      {
        id: 'cover',
        style: 'sticky',
        title: '心路溯回',
        content: `这一年，关键词是：${data.keywords.join("、")}。\n\n${data.summaryCards[0]?.content || "记录下你的心路历程..."}`,
        footer: 'KEY: REFLECTION',
        rotation: (Math.random() * 6 - 3),
        zIndex: 1,
        xOffset: (Math.random() - 0.5) * 40,
        yOffset: 0
      },
      ...data.summaryCards.slice(1).map((c, i) => ({
        id: `card-${i}`,
        style: styles[(i + 1) % styles.length], // Offset to start from ticket
        title: c.title,
        content: c.content,
        footer: i % 2 === 0 ? 'ADMIT ONE' : 'DELIGHT',
        rotation: (Math.random() * 10 - 5),
        zIndex: i + 2,
        xOffset: (Math.random() - 0.5) * 100,
        yOffset: (Math.random() - 0.5) * 50
      }))
    ];
    setQueue(initCards);
  }, [data]);

  const handleDevelopNext = () => {
    if (queue.length === 0 || isDeveloping) return;

    setIsDeveloping(true);
    playPolaroidSound();

    const nextCard = queue[0];
    const remaining = queue.slice(1);

    // Simulate developing time
    setTimeout(() => {
        setOnBoardCards(prev => [...prev, nextCard]);
        setQueue(remaining);
        setIsDeveloping(false);
    }, 800); 
  };

  const handleDownload = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#2e2622', 
        scale: 2,
        useCORS: true
    });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "2025-Yearly-FeltBoard.png";
    link.click();
  };

  const bringToFront = (id: string) => {
    setOnBoardCards(prev => {
        const maxZ = Math.max(...prev.map(c => c.zIndex));
        return prev.map(c => c.id === id ? { ...c, zIndex: maxZ + 1 } : c);
    });
  };

  // Render helpers for different card styles
  const renderCardContent = (card: PrintedCard) => {
    switch (card.style) {
      case 'sticky':
        return (
          <div className="w-[280px] bg-[#fef9c3] p-6 shadow-xl relative overflow-hidden font-handwriting text-stone-800"
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e7eb 28px)',
                 boxShadow: '2px 4px 8px rgba(0,0,0,0.2)'
               }}>
            {/* Tape */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm"></div>
            
            <h3 className="text-2xl font-bold mb-4 mt-2">{card.title}</h3>
            <p className="text-lg leading-loose">{card.content}</p>
            <div className="mt-6 flex items-center gap-2 text-stone-500 text-sm">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>{card.footer}</span>
            </div>
          </div>
        );

      case 'ticket':
        return (
          <div className="w-[300px] bg-[#e5e5e5] p-4 shadow-xl font-mono text-stone-800 relative">
            <div className="border-2 border-stone-400 p-4 border-dashed relative">
              <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4">
                 <span className="text-xs tracking-widest">ADMIT ONE</span>
                 <span className="text-xs">2025</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2 font-serif uppercase tracking-widest">{card.title}</h3>
              <p className="text-xs leading-relaxed text-justify mb-4 opacity-80">{card.content}</p>
              
              <div className="flex justify-between items-center mt-4 pt-2 border-t border-stone-400">
                <span className="bg-stone-800 text-white px-2 py-1 text-[10px]">DEST: 2025</span>
                <span className="font-bold text-xs">EXPLORE</span>
              </div>
            </div>
            {/* Cutouts */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#2e2622] rounded-full"></div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#2e2622] rounded-full"></div>
          </div>
        );

      case 'letter':
        return (
            <div className="w-[280px] bg-[#fdfbf7] p-6 shadow-xl font-serif text-stone-900 relative flex flex-col items-center text-center">
              <div className="w-full flex justify-between text-[10px] text-stone-400 uppercase tracking-widest mb-6">
                <span>Chapter 01</span>
                <span>2025</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">{card.title}</h3>
              <div className="w-12 h-0.5 bg-stone-900 mb-6"></div>
              <p className="text-sm leading-loose text-justify">{card.content}</p>
              
              <div className="mt-8 mb-2 px-4 py-1 border border-stone-300 rounded-full text-[10px] tracking-widest text-stone-400">
                ASPIRE
              </div>
            </div>
        );

      case 'polaroid':
        return (
          <div className="w-[260px] bg-white p-3 pb-8 shadow-xl relative transform transition-transform">
             {/* Dark Photo Area */}
             <div className="w-full aspect-square bg-stone-900 flex items-center justify-center relative overflow-hidden mb-4">
                 <div className="absolute inset-0 bg-gradient-to-tr from-stone-800 to-stone-900"></div>
                 {/* Decorative graphic */}
                 <div className="text-6xl text-stone-700 font-handwriting opacity-20 rotate-12">2025</div>
                 <p className="relative z-10 text-stone-100 text-center px-4 text-xs font-mono leading-relaxed tracking-wider opacity-80">
                    {card.content}
                 </p>
             </div>
             <div className="px-2">
                <h3 className="font-handwriting text-2xl text-stone-800 rotate-[-2deg]">{card.title}</h3>
                <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-stone-400 font-mono tracking-widest border border-stone-200 px-2 rounded">2025.12.31</span>
                </div>
             </div>
             {/* Sticker */}
             <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-400/80 backdrop-blur shadow-sm flex items-center justify-center text-white text-xs">
                <Sparkles size={12} />
             </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
        {/* Controls */}
        <div className="w-full flex justify-between gap-4 mb-4 px-4 max-w-4xl z-50">
            <div className="text-xs text-stone-500 font-mono flex items-center gap-2">
                 <MousePointer2 size={12} /> 拖拽整理回忆
            </div>
            <div className="flex gap-2">
                <button 
                  onClick={handleDevelopNext}
                  disabled={queue.length === 0 || isDeveloping}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs tracking-wider transition-all shadow-md
                    ${queue.length === 0 
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-stone-800 text-white hover:bg-stone-700 active:scale-95'}`}
                >
                    <Camera size={14} />
                    {queue.length > 0 ? `显影 (${queue.length})` : '已完成'}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-stone-200 shadow-sm">
                    <Download size={14} /> 保存
                </button>
            </div>
        </div>

        {/* The Felt Board Area */}
        <div ref={containerRef} className="relative w-full min-h-[800px] bg-[#2e2622] rounded-xl overflow-hidden shadow-2xl border-[8px] border-[#4a3b32]">
            {/* Felt Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" 
                 style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                 }}></div>

            {/* Empty State / Hint */}
            {onBoardCards.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-600/30">
                    <Camera size={48} className="mb-4 opacity-50" />
                    <p className="font-mono text-sm tracking-[0.2em] uppercase">Click Develop to Start</p>
                </div>
            )}

            {/* Cards Layer */}
            <div className="absolute inset-0 overflow-hidden">
                {onBoardCards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
                        onMouseDown={() => bringToFront(card.id)}
                        initial={{ scale: 0, opacity: 0, y: 100 }} 
                        animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            y: card.yOffset, // Random scatter
                            x: card.xOffset, 
                            rotate: card.rotation
                        }}
                        style={{ 
                            zIndex: card.zIndex,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -150, // rough center offset
                            marginLeft: -140,
                        }}
                        transition={{ 
                            type: "spring",
                            damping: 15,
                            stiffness: 100
                        }}
                        className="cursor-grab touch-none"
                    >
                        {renderCardContent(card)}
                    </motion.div>
                ))}
            </div>
            
            {/* Decoration Elements (Stickers/Pins) */}
            <div className="absolute top-8 right-8 text-stone-500/20 rotate-12">
                <Sparkles size={64} />
            </div>
            <div className="absolute bottom-12 left-12 w-24 h-24 rounded-full border-4 border-stone-600/30 opacity-20"></div>
        </div>
    </div>
  );
};

export default ReportCards;