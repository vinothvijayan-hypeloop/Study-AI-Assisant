
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, QuestionResult } from '@/components/StudyAssistant';

interface PdfInfo {
  file: File;
  totalPages: number;
}

interface ComprehensiveResults {
  pageAnalyses: Array<{
    pageNumber: number;
    keyPoints: string[];
    studyPoints: Array<{
      title: string;
      description: string;
      importance: "high" | "medium" | "low";
      tnpscRelevance: string;
    }>;
    summary: string;
    tnpscRelevance: string;
  }>;
  overallSummary: string;
  totalKeyPoints: string[];
  tnpscCategories: string[];
}

interface AppContextType {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  analysisResults: AnalysisResult[];
  setAnalysisResults: (results: AnalysisResult[]) => void;
  questionResult: QuestionResult | null;
  setQuestionResult: (result: QuestionResult | null) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  outputLanguage: "english" | "tamil";
  setOutputLanguage: (language: "english" | "tamil") => void;
  pdfInfo: PdfInfo | null;
  setPdfInfo: (info: PdfInfo | null) => void;
  pdfFullText: string;
  setPdfFullText: (text: string) => void;
  comprehensiveResults: ComprehensiveResults | null;
  setComprehensiveResults: (results: ComprehensiveResults | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  clearAppState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [outputLanguage, setOutputLanguage] = useState<"english" | "tamil">("english");
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [pdfFullText, setPdfFullText] = useState<string>("");
  const [comprehensiveResults, setComprehensiveResults] = useState<ComprehensiveResults | null>(null);
  const [currentView, setCurrentView] = useState<string>("upload");

  const clearAppState = () => {
    setSelectedFiles([]);
    setAnalysisResults([]);
    setQuestionResult(null);
    setDifficulty("medium");
    setOutputLanguage("english");
    setPdfInfo(null);
    setPdfFullText("");
    setComprehensiveResults(null);
    setCurrentView("upload");
  };

  return (
    <AppContext.Provider value={{
      selectedFiles,
      setSelectedFiles,
      analysisResults,
      setAnalysisResults,
      questionResult,
      setQuestionResult,
      difficulty,
      setDifficulty,
      outputLanguage,
      setOutputLanguage,
      pdfInfo,
      setPdfInfo,
      pdfFullText,
      setPdfFullText,
      comprehensiveResults,
      setComprehensiveResults,
      currentView,
      setCurrentView,
      clearAppState
    }}>
      {children}
    </AppContext.Provider>
  );
};
