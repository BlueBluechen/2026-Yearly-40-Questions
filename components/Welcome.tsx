import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center font-serif relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-stone-300 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-stone-400 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="mb-8 w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center text-white text-3xl font-handwriting">
          2025
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-ink mb-4">
          年度四十问
        </h1>
        
        <div className="w-16 h-1 bg-ink/20 my-6"></div>

        <p className="text-sm md:text-base text-stone-500 max-w-md leading-loose mb-12 font-light">
          这一年，匆匆而过。<br/>
          有些日子成了回忆，<br/>
          有些瞬间成了永恒。<br/>
          用一些时间，与自己对话。
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group flex items-center gap-3 px-8 py-3 bg-stone-800 text-white rounded-md shadow-lg hover:bg-stone-700 transition-all duration-300"
        >
          <span className="tracking-widest text-sm">开启回顾</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <p className="mt-8 text-[10px] text-stone-400 tracking-widest uppercase">
          A Journey of Self-Reflection
        </p>
      </motion.div>
    </div>
  );
};

export default Welcome;