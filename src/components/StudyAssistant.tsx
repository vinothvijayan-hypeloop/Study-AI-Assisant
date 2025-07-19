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
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 particle-bg">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-6 mb-6">
             <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl shadow-elegant-lg pulse-glow floating-element">
                <Brain className="h-12 w-12 text-white" />
             </div>
             <h1 className="text-6xl md:text-7xl font-black gradient-text tracking-tight">
              Ram's AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Transform your TNPSC preparation with AI-powered analysis. Upload your study materials and get instant insights, key points, and practice questions.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        <Card className="glass-card p-8 sm:p-12 mb-16 animate-fadeInUp hover-lift" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-4">
                <label className="flex items-center text-base font-bold text-gray-800 tracking-tight">
                  <Settings className="h-4 w-4 mr-2 text-purple-600" />
                  Difficulty Level
                </label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                    <SelectTrigger className="input-elegant w-full h-14 text-base">
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy" className="text-base py-3">🟢 Easy - Basic concepts</SelectItem>
                        <SelectItem value="medium" className="text-base py-3">🟡 Medium - Standard level</SelectItem>
                        <SelectItem value="hard" className="text-base py-3">🔴 Hard - Advanced level</SelectItem>
                        <SelectItem value="very-hard" className="text-base py-3">⚫ Very Hard - Expert level</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center text-base font-bold text-gray-800 tracking-tight">
                  <Languages className="h-4 w-4 mr-2 text-blue-600" />
                  Output Language
                </label>
                <Select value={outputLanguage} onValueChange={(value) => setOutputLanguage(value as "english" | "tamil")}>
                  <SelectTrigger className="input-elegant w-full h-14 text-base">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english" className="text-base py-3">🇬🇧 English</SelectItem>
                    <SelectItem value="tamil" className="text-base py-3">🇮🇳 தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative p-8 border-3 border-dashed border-gray-300/60 rounded-3xl bg-gradient-to-br from-white/40 via-blue-50/30 to-purple-50/30 hover:border-blue-400/60 hover:bg-gradient-to-br hover:from-blue-50/50 hover:via-purple-50/40 hover:to-pink-50/30 transition-all duration-500 backdrop-blur-sm group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block text-center py-8 relative z-10">
                <Upload className="h-16 w-16 text-gray-500 mx-auto mb-6 icon-bounce group-hover:text-blue-500 transition-colors duration-300" />
                <p className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
                  Upload Your Study Materials
                </p>
                <p className="text-lg text-gray-600 mb-2 font-medium">
                  Drag & drop or click to select images and PDF files
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  Supports: JPG, PNG, GIF, PDF (up to 10MB each)
                </p>
              </label>
            </div>

            {/* If files are selected, show analysis buttons */}
            {selectedFiles.length > 0 && (
              <div className="mt-10">
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-2xl border border-green-200/50">
                  <div className="flex items-center justify-center gap-3 text-green-700">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">{selectedFiles.length} file(s) selected and ready for analysis</span>
                  </div>
                </div>
                  <Button 
                      onClick={analyzeFiles} 
                      disabled={isAnalyzing} 
                      className="w-full btn-primary py-8 text-xl font-bold rounded-2xl shadow-elegant-lg hover:shadow-elegant transform hover:scale-105 transition-all duration-500 group relative overflow-hidden"
                  >
                      {isAnalyzing ? (
                          <>
                              <div className="spinner-modern mr-4"></div>
                              <span className="relative z-10">Analyzing {selectedFiles.length} file(s)...</span>
                          </>
                      ) : (
                          <>
                              <span className="relative z-10">Start AI Analysis</span>
                              <ChevronsRight className="h-7 w-7 ml-3 transition-transform duration-500 group-hover:translate-x-2 relative z-10" />
                          </>
                      )}
                  </Button>
              </div>
            )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
          <Card className="glass-card p-8 text-center hover-lift group">
            <div className="p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 rounded-3xl w-fit mx-auto mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element">
              <FileText className="h-10 w-10 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">Smart Analysis</h3>
            <p className="text-gray-600 text-base leading-relaxed font-medium">
              AI-powered analysis extracts key points and creates crisp, memorable study notes.
            </p>
          </Card>

          <Card className="glass-card p-8 text-center hover-lift group">
            <div className="p-6 bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 rounded-3xl w-fit mx-auto mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '1s' }}>
              <Brain className="h-10 w-10 text-purple-600 group-hover:text-pink-600 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">MCQ & Assertion Questions</h3>
            <p className="text-gray-600 text-base leading-relaxed font-medium">
              Generate TNPSC-style multiple choice and assertion-reason questions for practice.
            </p>
          </Card>

          <Card className="glass-card p-8 text-center hover-lift group">
            <div className="p-6 bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 rounded-3xl w-fit mx-auto mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '2s' }}>
              <Zap className="h-10 w-10 text-green-600 group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">Instant Results</h3>
            <p className="text-gray-600 text-base leading-relaxed font-medium">
              Get immediate feedback with detailed explanations and performance tracking.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;