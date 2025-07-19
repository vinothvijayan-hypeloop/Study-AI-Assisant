import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Brain, Zap, Settings, Languages, ChevronsRight } from "lucide-react";
import { analyzeImage, analyzeMultipleImages, analyzePdfContent, analyzePdfContentComprehensive, generateQuestions as generateQuestionsFromService } from "@/services/geminiService";
import { extractAllPdfText, findTotalPagesFromOcr, extractPageRangeFromOcr } from "@/utils/pdfReader";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import AnalysisResults from "./AnalysisResults";
import QuestionResults from "./QuestionResults";
import ModernQuizMode from "./ModernQuizMode";
import QuickAnalysisMode from "./QuickAnalysisMode";
import PdfPageSelector from "./PdfPageSelector";
import ComprehensivePdfResults from "./ComprehensivePdfResults";
import PdfPageNavigator from "./PdfPageNavigator";

// Interfaces remain the same...
export interface AnalysisResult { /* ... */ }
export interface StudyPoint { /* ... */ }
export interface Question { /* ... */ }
export interface QuestionResult { /* ... */ }

const StudyAssistant = () => {
  const {
    // ... all your useAppContext hooks
    selectedFiles, setSelectedFiles, analysisResults, setAnalysisResults, questionResult, setQuestionResult, difficulty, setDifficulty, outputLanguage, setOutputLanguage, pdfInfo, setPdfInfo, pdfFullText, setPdfFullText, comprehensiveResults, setComprehensiveResults, currentView, setCurrentView, clearAppState
  } = useAppContext();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // All your handler functions (handleFileSelect, analyzeFiles, etc.) remain exactly the same.
  // The logic is sound, we are only changing the JSX presentation.
  const handleFileSelect = (files: FileList | null) => { /* ... */ };
  const analyzeFiles = async () => { /* ... */ };
  const analyzePdfFile = async (file: File, startPage?: number, endPage?: number) => { /* ... */ };
  const analyzeComprehensivePdf = async (file: File) => { /* ... */ };
  const handlePdfPageRangeSelect = (startPage: number, endPage: number) => { /* ... */ };
  const handlePdfAnalyzeAll = () => { /* ... */ };
  const handleComprehensiveQuizGeneration = async (startPage: number, endPage: number) => { /* ... */ };
  const generateQuestionsFromAnalysis = async () => { /* ... */ };
  const handleGenerateNextPage = async (pageNumber: number) => { /* ... */ };
  const startQuickAnalysis = () => { /* ... */ };
  const handleQuickAnalysisQuiz = (result: QuestionResult) => { /* ... */ };
  const handlePdfNavigatorQuiz = async (pageRange: { start: number; end: number }, difficulty: string) => { /* ... */ };
  const resetToUpload = () => { /* ... */ };
  const startQuizFromAnalysis = () => { /* ... */ };

  // Conditional rendering logic for other views remains the same.
  if (currentView === "quick-analysis") { /* ... */ }
  if (currentView === "quiz" && questionResult) { /* ... */ }
  // ... and so on for all other views.

  // The main JSX to render for the upload screen:
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-4 mb-4">
             <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg pulse-glow">
                <Brain className="h-10 w-10 text-white" />
             </div>
             <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Ram's AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your TNPSC preparation with AI-powered analysis. Upload your study materials and get instant insights, key points, and practice questions.
          </p>
        </div>

        <Card className="glass-card p-6 sm:p-10 mb-12 animate-fadeInUp hover-lift" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-800">
                  <Settings className="h-4 w-4 mr-2 text-purple-600" />
                  Difficulty Level
                </label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                    <SelectTrigger className="input-elegant w-full">
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">🟢 Easy - Basic concepts</SelectItem>
                        <SelectItem value="medium">🟡 Medium - Standard level</SelectItem>
                        <SelectItem value="hard">🔴 Hard - Advanced level</SelectItem>
                        <SelectItem value="very-hard">⚫ Very Hard - Expert level</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-800">
                  <Languages className="h-4 w-4 mr-2 text-blue-600" />
                  Output Language
                </label>
                <Select value={outputLanguage} onValueChange={(value) => setOutputLanguage(value as "english" | "tamil")}>
                  <SelectTrigger className="input-elegant w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">🇬🇧 GB English</SelectItem>
                    <SelectItem value="tamil">🇮🇳 தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white/30 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block text-center py-6">
                <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4 icon-bounce" />
                <p className="text-xl font-semibold text-gray-800 mb-1">
                  Upload Your Study Materials
                </p>
                <p className="text-gray-500">
                  Drag & drop or click to select images and PDF files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: JPG, PNG, GIF, PDF (up to 10MB each)
                </p>
              </label>
            </div>

            {/* If files are selected, show analysis buttons */}
            {selectedFiles.length > 0 && (
              <div className="mt-8">
                  <Button 
                      onClick={analyzeFiles} 
                      disabled={isAnalyzing} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-7 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 group"
                  >
                      {isAnalyzing ? (
                          <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Analyzing {selectedFiles.length} file(s)...
                          </>
                      ) : (
                          <>
                              Start Analysis <ChevronsRight className="h-6 w-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                      )}
                  </Button>
              </div>
            )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card p-6 text-center hover-lift animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-fit mx-auto mb-4 shadow-inner">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered analysis extracts key points and creates crisp, memorable study notes.
            </p>
          </Card>

          <Card className="glass-card p-6 text-center hover-lift animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-fit mx-auto mb-4 shadow-inner">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">MCQ & Assertion Questions</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Generate TNPSC-style multiple choice and assertion-reason questions for practice.
            </p>
          </Card>

          <Card className="glass-card p-6 text-center hover-lift animate-fadeInUp" style={{ animationDelay: '500ms' }}>
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-fit mx-auto mb-4 shadow-inner">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get immediate feedback with detailed explanations and performance tracking.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;