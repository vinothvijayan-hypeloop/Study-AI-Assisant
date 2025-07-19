
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, FileText, Users, MessageCircle, Target, Award, TrendingUp } from "lucide-react";
import AuthModal from "./AuthModal";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    // User is now authenticated, App.tsx will handle the redirect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 relative overflow-hidden particle-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl floating-element"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-purple-400/10 via-blue-400/10 to-pink-400/10 rounded-full blur-3xl floating-element" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-elegant shadow-elegant border-b border-gray-200/50 relative z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-elegant pulse-glow">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-black gradient-text tracking-tight">
                TNPSC Study Assistant
              </h1>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleAuthClick}
                className="hidden md:flex btn-secondary"
              >
                Login
              </Button>
              <Button 
                onClick={handleAuthClick}
                className="btn-primary px-6 py-3 rounded-2xl"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 gradient-text animate-fadeInUp tracking-tight leading-tight">
            Master TNPSC Exams with AI
          </h2>
          <p className="text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed animate-fadeInUp font-medium" style={{animationDelay: '0.2s'}}>
            Transform your TNPSC preparation with our intelligent study assistant. 
            Analyze documents, generate questions, and get personalized guidance from Arivu - your AI study companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg"
              onClick={handleAuthClick}
              className="btn-primary text-xl px-12 py-6 rounded-2xl font-bold"
            >
              Start Learning Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-16 gradient-text animate-fadeInUp tracking-tight">
            Everything You Need to Ace TNPSC
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-animation">
            <Card className="glass-card p-8 hover-lift group">
              <div className="p-4 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 rounded-2xl w-fit mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element">
                <FileText className="h-8 w-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">Smart Document Analysis</h4>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                Upload images or PDFs and get instant analysis with key points, summaries, and TNPSC relevance scores.
              </p>
            </Card>

            <Card className="glass-card p-8 hover-lift group">
              <div className="p-4 bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 rounded-2xl w-fit mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '1s' }}>
                <Brain className="h-8 w-8 text-purple-600 group-hover:text-pink-600 transition-colors duration-300" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">AI Question Generator</h4>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                Generate practice questions based on your study materials with customizable difficulty levels.
              </p>
            </Card>

            <Card className="glass-card p-8 hover-lift group">
              <div className="p-4 bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 rounded-2xl w-fit mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '2s' }}>
                <MessageCircle className="h-8 w-8 text-green-600 group-hover:text-emerald-600 transition-colors duration-300" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">Arivu - AI Chatbot</h4>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                Get instant answers to your questions, clarify doubts, and receive personalized study guidance.
              </p>
            </Card>

            <Card className="glass-card p-8 hover-lift group">
              <div className="p-4 bg-gradient-to-br from-indigo-100 via-indigo-200 to-blue-200 rounded-2xl w-fit mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '3s' }}>
                <Target className="h-8 w-8 text-indigo-600 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">Interactive Quizzes</h4>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                Test your knowledge with interactive quizzes and track your progress over time.
              </p>
            </Card>

            <Card className="glass-card p-8 hover-lift group">
              <div className="p-4 bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-200 rounded-2xl w-fit mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '4s' }}>
                <Award className="h-8 w-8 text-yellow-600 group-hover:text-orange-600 transition-colors duration-300" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">Study History</h4>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                Keep track of your learning journey with detailed study history and performance analytics.
              </p>
            </Card>

            <Card className="glass-card p-8 hover-lift group">
              <div className="p-4 bg-gradient-to-br from-red-100 via-red-200 to-pink-200 rounded-2xl w-fit mb-6 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500 floating-element" style={{ animationDelay: '5s' }}>
                <TrendingUp className="h-8 w-8 text-red-600 group-hover:text-pink-600 transition-colors duration-300" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">Progress Tracking</h4>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                Monitor your improvement with detailed analytics and personalized recommendations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <Card className="p-12 md:p-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-elegant-lg animate-fadeInScale rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight relative z-10">
              Ready to Transform Your TNPSC Preparation?
            </h3>
            <p className="text-2xl mb-10 opacity-90 font-medium leading-relaxed relative z-10">
              Join thousands of successful candidates who've achieved their dreams with our AI-powered study assistant.
            </p>
            <Button 
              size="lg"
              onClick={handleAuthClick}
              className="bg-white text-blue-600 hover:bg-gray-50 text-xl px-12 py-6 font-bold shadow-elegant hover:shadow-elegant-lg transform hover:scale-105 transition-all duration-500 rounded-2xl relative z-10"
            >
              Start Your Journey Today
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-elegant">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-3xl font-black gradient-text">TNPSC Study Assistant</h4>
          </div>
          <p className="text-gray-300 mb-8 text-lg font-medium">
            Empowering TNPSC aspirants with AI-driven learning solutions
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400 font-medium">
            <span>© 2024 TNPSC Study Assistant</span>
            <span>•</span>
            <span>Powered by AI</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default LandingPage;
