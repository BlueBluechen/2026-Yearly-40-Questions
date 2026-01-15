import React, { useState } from 'react';
import { AIReportData, Answers, ReportMode } from '../types';
import ReportCards from './ReportCards';
import ReportNotebook from './ReportNotebook';
import { Layers, BookOpen, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportProps {
  answers: Answers;
  reportData: AIReportData;
  onRestart: () => void;
}

const Report: React.FC<ReportProps> = ({ answers, reportData, onRestart }) => {
  const [mode, setMode] = useState<ReportMode>(ReportMode.PRINTER);

  return (
    <div className="min-h-screen bg-stone-50 font-serif flex flex-col items-center py-8">
      
      {/* Navbar / Mode Switcher */}
      <div className="fixed top-8 z-40 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-stone-200 flex gap-4">
        <button
            onClick={() => setMode(ReportMode.PRINTER)}
            className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full transition-all ${mode === ReportMode.PRINTER ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
        >
            <Layers size={14} /> 卡片模式
        </button>
        <button
            onClick={() => setMode(ReportMode.NOTEBOOK)}
            className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full transition-all ${mode === ReportMode.NOTEBOOK ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
        >
            <BookOpen size={14} /> 笔记模式
        </button>
        <div className="w-[1px] h-6 bg-stone-200 mx-1"></div>
        <button 
            onClick={onRestart}
            className="text-stone-400 hover:text-stone-800 transition-colors"
            title="重新开始"
        >
            <RotateCcw size={16} />
        </button>
      </div>

      <div className="w-full max-w-5xl mt-20 px-4">
        <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {mode === ReportMode.PRINTER ? (
                <ReportCards data={reportData} />
            ) : (
                <ReportNotebook answers={answers} />
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default Report;