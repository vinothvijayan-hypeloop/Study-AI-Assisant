import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Brain, Zap, Settings, Languages } from "lucide-react";
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

export interface AnalysisResult {
  keyPoints: string[];
  summary: string;
  tnpscRelevance: string;
  studyPoints: StudyPoint[];
  tnpscCategories: string[];
  language?: string;
  mainTopic?: string;
}

export interface StudyPoint {
  title: string;
  description: string;
  importance: "high" | "medium" | "low";
  tnpscRelevance?: string;
  tnpscPriority?: "high" | "medium" | "low";
  memoryTip?: string;
}

export interface Question {
  question: string;
  options?: string[];
  answer: string;
  type: "mcq" | "assertion_reason";
  difficulty: string;
  tnpscGroup: string;
  explanation?: string;
}

export interface QuestionResult {
  questions: Question[];
  summary: string;
  keyPoints: string[];
  difficulty: string;
  totalQuestions?: number;
}

const StudyAssistant = () => {
  const {
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
  } = useAppContext();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== fileArray.length) {
      toast.error("Only image files (PNG, JPG, etc.) and PDF files are supported");
    }
    
    // For this UI, we are not showing the file preview, so we just set them.
    // The original logic to show them is fine, but the image doesn't depict it.
    setSelectedFiles(validFiles);
  };

  const analyzeFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to analyze");
      return;
    }

    // Check if there's a PDF file
    const pdfFile = selectedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      try {
        const fullText = await extractAllPdfText(pdfFile);
        const totalPages = findTotalPagesFromOcr(fullText);
        
        if (totalPages > 0) {
          setPdfInfo({ file: pdfFile, totalPages });
          setPdfFullText(fullText);
          setCurrentView("pdf-page-select");
          return;
        } else {
          // Fallback to regular PDF analysis if no OCR markers found
          toast.info("No page markers found. Analyzing entire PDF...");
          await analyzePdfFile(pdfFile);
        }
      } catch (error) {
        console.error("PDF analysis error:", error);
        toast.error("Failed to analyze PDF. Please try again.");
      }
      return;
    }

    // Handle image files
    setIsAnalyzing(true);
    try {
      const results: AnalysisResult[] = [];
      
      for (const file of selectedFiles) {
        if (file.type.startsWith('image/')) {
          const result = await analyzeImage(file, outputLanguage);
          results.push({
            ...result,
            language: outputLanguage,
            mainTopic: result.studyPoints?.[0]?.title || "Study Material"
          });
        }
      }
      
      setAnalysisResults(results);
      setCurrentView("analysis");
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze files. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzePdfFile = async (file: File, startPage?: number, endPage?: number) => {
    setIsAnalyzing(true);
    try {
      const fullText = await extractAllPdfText(file);
      let contentToAnalyze = fullText;
      
      if (startPage && endPage) {
        contentToAnalyze = extractPageRangeFromOcr(fullText, startPage, endPage);
        toast.info(`Analyzing pages ${startPage} to ${endPage}...`);
      }
      
      const result = await analyzePdfContent(contentToAnalyze, outputLanguage);
      setAnalysisResults([{
        ...result,
        language: outputLanguage,
        mainTopic: `${file.name} ${startPage && endPage ? `(Pages ${startPage}-${endPage})` : ''}`
      }]);
      setCurrentView("analysis");
      toast.success("PDF analysis completed successfully!");
    } catch (error) {
      console.error("PDF analysis error:", error);
      toast.error("Failed to analyze PDF. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeComprehensivePdf = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const fullText = await extractAllPdfText(file);
      toast.info("Starting comprehensive analysis of all pages...");
      
      const result = await analyzePdfContentComprehensive(fullText, outputLanguage);
      setComprehensiveResults(result);
      setCurrentView("comprehensive-pdf");
      toast.success(`Comprehensive analysis completed! Analyzed ${result.pageAnalyses.length} pages.`);
    } catch (error) {
      console.error("Comprehensive PDF analysis error:", error);
      toast.error("Failed to analyze PDF comprehensively. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePdfPageRangeSelect = (startPage: number, endPage: number) => {
    if (pdfInfo) {
      setCurrentView("pdf-navigator");
    }
  };

  const handlePdfAnalyzeAll = () => {
    if (pdfInfo) {
      analyzeComprehensivePdf(pdfInfo.file);
    }
  };

  const handleComprehensiveQuizGeneration = async (startPage: number, endPage: number) => {
    if (!pdfInfo || !comprehensiveResults) return;
    
    setIsGeneratingQuestions(true);
    try {
      const fullText = await extractAllPdfText(pdfInfo.file);
      const contentToAnalyze = extractPageRangeFromOcr(fullText, startPage, endPage);
      
      const analysisResult = await analyzePdfContent(contentToAnalyze, outputLanguage);
      const result = await generateQuestionsFromService([analysisResult], difficulty, outputLanguage);
      
      setQuestionResult({
        ...result,
        totalQuestions: result.questions?.length || 0
      });
      setCurrentView("questions");
      toast.success("Questions generated successfully!");
    } catch (error) {
      console.error("Question generation error:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const generateQuestionsFromAnalysis = async () => {
    if (analysisResults.length === 0) return;
    
    setIsGeneratingQuestions(true);
    try {
      const result = await generateQuestionsFromService(analysisResults, difficulty, outputLanguage);
      setQuestionResult({
        ...result,
        totalQuestions: result.questions?.length || 0
      });
      setCurrentView("questions");
      toast.success("Questions generated successfully!");
    } catch (error) {
      console.error("Question generation error:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleGenerateNextPage = async (pageNumber: number) => {
    if (!pdfInfo) return;
    try {
      const fullText = await extractAllPdfText(pdfInfo.file);
      const pageContent = extractPageRangeFromOcr(fullText, pageNumber, pageNumber);
      if (!pageContent.trim()) {
        toast.error(`No content found on page ${pageNumber}`);
        return;
      }
      const result = await analyzePdfContent(pageContent, outputLanguage);
      const newPageAnalysis = {
        pageNumber,
        keyPoints: result.keyPoints || [],
        studyPoints: (result.studyPoints || []).map(point => ({
          title: point.title,
          description: point.description,
          importance: point.importance,
          tnpscRelevance: point.tnpscRelevance || ''
        })),
        summary: result.summary || '',
        tnpscRelevance: result.tnpscRelevance || ''
      };
      setComprehensiveResults(prev => {
        if (!prev) return null;
        const pageExists = prev.pageAnalyses.some(p => p.pageNumber === pageNumber);
        if (pageExists) return prev;
        const updatedResults = {
          ...prev,
          pageAnalyses: [...prev.pageAnalyses, newPageAnalysis].sort((a, b) => a.pageNumber - b.pageNumber),
          totalKeyPoints: [...prev.totalKeyPoints, ...(result.keyPoints || [])]
        };
        return updatedResults;
      });
    } catch (error) {
      console.error(`Error analyzing page ${pageNumber}:`, error);
      toast.error(`Failed to analyze page ${pageNumber}. Please try again.`);
      throw error;
    }
  };

  const startQuickAnalysis = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }
    setCurrentView("quick-analysis");
  };

  const handleQuickAnalysisQuiz = (result: QuestionResult) => {
    setQuestionResult({
      ...result,
      totalQuestions: result.questions?.length || 0
    });
    setCurrentView("quiz");
  };

  const handlePdfNavigatorQuiz = async (pageRange: { start: number; end: number }, difficulty: string) => {
    if (!pdfInfo) return;
    
    setIsGeneratingQuestions(true);
    try {
      const contentToAnalyze = extractPageRangeFromOcr(pdfFullText, pageRange.start, pageRange.end);
      
      const analysisResult = await analyzePdfContent(contentToAnalyze, outputLanguage);
      const result = await generateQuestionsFromService([analysisResult], difficulty, outputLanguage);
      
      setQuestionResult({
        ...result,
        totalQuestions: result.questions?.length || 0
      });
      setCurrentView("questions");
      toast.success("Questions generated successfully!");
    } catch (error) {
      console.error("Question generation error:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const resetToUpload = () => {
    clearAppState();
    setCurrentView("upload");
  };

  const startQuizFromAnalysis = () => {
    if (questionResult) {
      setCurrentView("quiz");
    }
  };

  // The following 'if' blocks handle rendering for different views. The logic remains the same.
  if (currentView === "quick-analysis") {
    return <QuickAnalysisMode files={selectedFiles} difficulty={difficulty} outputLanguage={outputLanguage} onStartQuiz={handleQuickAnalysisQuiz} onReset={resetToUpload} />;
  }
  if (currentView === "quiz" && questionResult) {
    return <ModernQuizMode result={questionResult} onReset={resetToUpload} onBackToAnalysis={() => setCurrentView("analysis")} difficulty={difficulty} outputLanguage={outputLanguage} />;
  }
  if (currentView === "questions" && questionResult) {
    return <QuestionResults result={questionResult} onReset={resetToUpload} selectedFiles={selectedFiles} onStartQuiz={startQuizFromAnalysis} />;
  }
  if (currentView === "analysis" && analysisResults.length > 0) {
    return <AnalysisResults result={analysisResults[0]} onReset={resetToUpload} selectedFiles={selectedFiles} onGenerateQuestions={generateQuestionsFromAnalysis} onStartQuiz={startQuizFromAnalysis} isGeneratingQuestions={isGeneratingQuestions} />;
  }
  if (currentView === "comprehensive-pdf" && comprehensiveResults) {
    return <ComprehensivePdfResults pageAnalyses={comprehensiveResults.pageAnalyses} overallSummary={comprehensiveResults.overallSummary} totalKeyPoints={comprehensiveResults.totalKeyPoints} onReset={resetToUpload} onGenerateQuestions={handleComprehensiveQuizGeneration} onGenerateNextPage={handleGenerateNextPage} isGeneratingQuestions={isGeneratingQuestions} totalPdfPages={pdfInfo?.totalPages || 0} />;
  }
  if (currentView === "pdf-navigator" && pdfInfo) {
    return <PdfPageNavigator file={pdfInfo.file} totalPages={pdfInfo.totalPages} fullText={pdfFullText} outputLanguage={outputLanguage} onReset={resetToUpload} onStartQuiz={handlePdfNavigatorQuiz} />;
  }
  if (currentView === "pdf-page-select" && pdfInfo) {
    return (
      <div className="min-h-screen p-4 bg-[#F8F9FF]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800">PDF Page Selection</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose which pages you want to analyze for TNPSC preparation</p>
          </div>
          <PdfPageSelector fileName={pdfInfo.file.name} totalPages={pdfInfo.totalPages} onPageRangeSelect={handlePdfPageRangeSelect} onAnalyzeAll={handlePdfAnalyzeAll} isAnalyzing={isAnalyzing} />
          <div className="mt-6 text-center"><Button onClick={resetToUpload} variant="outline">Back to Upload</Button></div>
        </div>
      </div>
    );
  }

  // This is the main view to be rendered, matching the provided image.
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-[#F8F9FF]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
             <div className="p-3 bg-white rounded-full shadow-md">
                <img src="/logo.svg" alt="Ram's AI Logo" className="h-12 w-12" />
             </div>
             <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
              Ram's AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your TNPSC preparation with AI-powered analysis. Upload your study materials and get instant insights, key points, and practice questions.
          </p>
        </div>

        <Card className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue>
                            <div className="flex items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2"></div>
                                Medium - Standard level
                            </div>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy - Basic concepts</SelectItem>
                        <SelectItem value="medium">Medium - Standard level</SelectItem>
                        <SelectItem value="hard">Hard - Advanced level</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Language
                </label>
                <Select value={outputLanguage} onValueChange={(value) => setOutputLanguage(value as "english" | "tamil")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">GB English</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-1">
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
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white p-6 text-center shadow-sm rounded-xl">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Analysis</h3>
            <p className="text-gray-600 text-sm">
              AI-powered analysis extracts key points and creates crisp, memorable study notes
            </p>
          </Card>

          <Card className="bg-white p-6 text-center shadow-sm rounded-xl">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">MCQ & Assertion Questions</h3>
            <p className="text-gray-600 text-sm">
              Generate TNPSC-style multiple choice and assertion-reason questions for practice
            </p>
          </Card>

          <Card className="bg-white p-6 text-center shadow-sm rounded-xl">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Get immediate feedback with detailed explanations and performance tracking
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;