import React, { useState } from 'react';
import { AppState, Answers, AIReportData } from './types';
import Welcome from './components/Welcome';
import Questionnaire from './components/Questionnaire';
import Processing from './components/Processing';
import Report from './components/Report';
import { generateYearlyReport } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [answers, setAnswers] = useState<Answers>({});
  const [reportData, setReportData] = useState<AIReportData | null>(null);

  const startQuestionnaire = () => {
    setAppState(AppState.QUESTIONNAIRE);
  };

  const handleQuestionnaireComplete = async (collectedAnswers: Answers) => {
    setAnswers(collectedAnswers);
    setAppState(AppState.PROCESSING);

    // Call AI to generate report
    const data = await generateYearlyReport(collectedAnswers);
    setReportData(data);
    setAppState(AppState.REPORT);
  };

  const handleRestart = () => {
    // Optional: Confirm before restarting?
    setAnswers({});
    setReportData(null);
    setAppState(AppState.WELCOME);
  };

  return (
    <main className="text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      {appState === AppState.WELCOME && (
        <Welcome onStart={startQuestionnaire} />
      )}
      
      {appState === AppState.QUESTIONNAIRE && (
        <Questionnaire onComplete={handleQuestionnaireComplete} />
      )}

      {appState === AppState.PROCESSING && (
        <Processing />
      )}

      {appState === AppState.REPORT && reportData && (
        <Report 
            answers={answers} 
            reportData={reportData} 
            onRestart={handleRestart}
        />
      )}
    </main>
  );
};

export default App;