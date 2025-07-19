import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, LogOut, History, Settings, Brain, MessageCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { toast } from "sonner";
import AuthModal from "./AuthModal";

interface NavigationHeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const NavigationHeader = ({ currentView, onViewChange }: NavigationHeaderProps) => {
  const [user, loading] = useAuthState(auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      onViewChange("study");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const navItems = [
    { id: "study", label: "Study Assistant", icon: Brain },
    { id: "arivu", label: "Arivu Chat", icon: MessageCircle },
    { id: "history", label: "Study History", icon: History },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  return (
    <>
      <header className="bg-white/90 backdrop-blur-elegant border-b border-gray-200/50 sticky top-0 z-50 shadow-elegant transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl shadow-elegant pulse-glow">
                <Brain className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black gradient-text tracking-tight">
                  Ram's AI
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentView === item.id 
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-elegant hover:shadow-elegant-lg transform hover:scale-105" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 backdrop-blur-sm"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-3 md:gap-4">
              {user ? (
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-gray-900 tracking-tight">
                      +91{user.phoneNumber?.replace('+91', '')}
                    </p>
                    <Badge variant="outline" className="text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105 rounded-xl font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="btn-primary flex items-center gap-2 px-4 md:px-6 py-3 rounded-2xl"
                  disabled={loading}
                  size="sm"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-semibold">Login</span>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200/50 bg-white/90 backdrop-blur-elegant animate-fadeInUp">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold ${
                      currentView === item.id 
                        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-elegant" 
                        : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    } transition-all duration-300`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          toast.success("Welcome to Ram's AI!");
        }}
      />
    </>
  );
};

export default NavigationHeader;
