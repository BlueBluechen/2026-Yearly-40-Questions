import React from 'react';
import { motion } from 'framer-motion';

const Processing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink font-serif">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-2 border-stone-200 border-t-stone-800 rounded-full mb-8"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="text-stone-500 tracking-widest text-sm"
      >
        正在梳理你的年度记忆...
      </motion.p>
      <p className="mt-2 text-[10px] text-stone-400">AI 正在生成总结与关键词</p>
    </div>
  );
};

export default Processing;