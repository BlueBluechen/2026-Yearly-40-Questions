import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, ArrowLeft, Send } from 'lucide-react';
import { QUESTIONS } from '../constants';
import { getQuestionHint } from '../services/geminiService';
import { Answers } from '../types';

interface QuestionnaireProps {
  onComplete: (answers: Answers) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  // Auto-focus textarea on question change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    setHint(null);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: e.target.value
    }));
  };

  const handleGetHint = async () => {
    if (hint) return;
    setIsLoadingHint(true);
    const generatedHint = await getQuestionHint(currentQuestion.text);
    setHint(generatedHint);
    setIsLoadingHint(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl+Enter or Cmd+Enter to go next
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-serif bg-paper relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-stone-200 z-50">
        <motion.div 
          className="h-full bg-stone-800"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-6 md:p-12 justify-center">
        {/* Header: Part Info & Hint Button */}
        <div className="flex justify-between items-center mb-12 text-stone-400 text-xs tracking-widest uppercase">
          <span>{currentIndex + 1} / {QUESTIONS.length} · PART {currentQuestion.part}</span>
          <button 
            onClick={handleGetHint}
            disabled={isLoadingHint}
            className="flex items-center gap-2 hover:text-stone-600 transition-colors disabled:opacity-50"
          >
            <Sparkles size={14} />
            {isLoadingHint ? '思考中...' : '灵感'}
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-ink">
              {currentQuestion.text}
            </h2>

            {/* Hint Display */}
            <AnimatePresence>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#f0ece5] p-4 rounded-lg text-stone-600 text-sm italic font-handwriting leading-loose border-l-2 border-stone-400">
                     “ {hint} ”
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative mt-4">
              <textarea
                ref={textareaRef}
                value={answers[currentQuestion.id] || ''}
                onChange={handleAnswerChange}
                onKeyDown={handleKeyDown}
                placeholder="写下你的回答..."
                className="w-full bg-transparent border-b border-stone-300 focus:border-stone-800 outline-none text-lg md:text-xl py-4 min-h-[150px] resize-none leading-loose font-serif text-stone-700 placeholder-stone-300 transition-colors"
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-stone-300">
                Cmd + Enter 换页
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 text-stone-500 hover:text-stone-800 transition-colors ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft size={16} />
            <span className="text-sm">上一题</span>
          </button>

          <div className="flex items-center gap-4">
             {/* Skip Button */}
             <button
              onClick={handleSkip}
              className="text-stone-400 hover:text-stone-600 text-sm transition-colors px-4 py-2"
            >
              跳过
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-stone-800 text-white px-6 py-3 rounded shadow hover:bg-stone-700 transition-all hover:gap-3"
            >
              <span className="text-sm tracking-widest">{currentIndex === QUESTIONS.length - 1 ? '完成' : '下一题'}</span>
              {currentIndex === QUESTIONS.length - 1 ? <Send size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;