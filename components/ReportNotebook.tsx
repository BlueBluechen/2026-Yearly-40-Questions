import React, { useRef, useState } from 'react';
import { Answers } from '../types';
import { QUESTIONS } from '../constants';
import html2canvas from 'html2canvas';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportNotebookProps {
  answers: Answers;
}

const PAGE_SIZE = 5; // Questions per page

const ReportNotebook: React.FC<ReportNotebookProps> = ({ answers }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(QUESTIONS.length / PAGE_SIZE);

  const handleDownload = async () => {
      if (!containerRef.current) return;
      const canvas = await html2canvas(containerRef.current, {
          backgroundColor: '#fdfbf7',
          scale: 2
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `2025-Notebook-Page-${currentPage + 1}.png`;
      link.click();
    };

  const currentQuestions = QUESTIONS.slice(
      currentPage * PAGE_SIZE, 
      (currentPage + 1) * PAGE_SIZE
  );

  return (
    <div className="w-full flex flex-col items-center">
        {/* Controls */}
        <div className="w-full flex justify-between items-center gap-4 mb-4 px-4 max-w-2xl">
             <div className="flex gap-2">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-30"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono self-center">PAGE {currentPage + 1} / {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-30"
                >
                    <ChevronRight size={16} />
                </button>
             </div>
            <button onClick={handleDownload} className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
                <Download size={14} /> 保存当前页
            </button>
        </div>

        {/* Notebook Visual */}
        <div ref={containerRef} className="bg-[#fffdf5] w-full max-w-2xl min-h-[700px] shadow-lg relative p-8 md:p-12 border-l-[12px] border-stone-800/10">
            {/* Binder Rings Simulation */}
            <div className="absolute left-[-6px] top-12 w-4 h-8 bg-stone-300 rounded-r shadow-inner"></div>
            <div className="absolute left-[-6px] top-1/2 w-4 h-8 bg-stone-300 rounded-r shadow-inner"></div>
            <div className="absolute left-[-6px] bottom-12 w-4 h-8 bg-stone-300 rounded-r shadow-inner"></div>

            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-stone-800 pb-2 mb-8">
                <h2 className="text-2xl font-serif font-bold text-stone-800">Part {currentQuestions[0]?.part}</h2>
                <div className="text-xs font-mono text-stone-400">2025 COLLECTION</div>
            </div>

            {/* Questions & Answers */}
            <div className="space-y-8">
                {currentQuestions.map((q) => (
                    <div key={q.id} className="relative group">
                        <h3 className="font-serif text-sm font-bold text-stone-900 mb-2">
                            <span className="mr-2 text-stone-400 font-mono">{String(q.id).padStart(2, '0')}.</span>
                            {q.text}
                        </h3>
                        <div className="w-full relative min-h-[3rem]">
                            {/* Lined Paper Background for Answer */}
                            <div className="absolute inset-0 w-full h-full flex flex-col justify-end pointer-events-none">
                                <div className="border-b border-blue-200/50 w-full h-8"></div>
                                <div className="border-b border-blue-200/50 w-full h-8"></div>
                                <div className="border-b border-blue-200/50 w-full h-8"></div>
                            </div>
                            
                            {/* Handwriting Text */}
                            <p className="font-handwriting text-xl text-stone-700 leading-loose relative z-10 pl-4 py-1">
                                {answers[q.id] || <span className="text-stone-300 text-base">（未填写）</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 right-8 text-[10px] text-stone-300 font-mono">
                WRITTEN BY YOU
            </div>
        </div>
    </div>
  );
};

export default ReportNotebook;