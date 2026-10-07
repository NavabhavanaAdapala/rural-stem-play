import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AgentChatbot from "@/components/AgentChatbot";
import OfflineBanner from "@/components/OfflineBanner";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Subjects from "@/pages/Subjects";
import SubjectQuizzes from "@/pages/SubjectQuizzes";
import Quiz from "@/pages/Quiz";
import Games from "@/pages/Games";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import AITutor from "@/pages/AITutor";
import TeacherDashboard from "@/pages/TeacherDashboard";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HelpCenter from "@/pages/HelpCenter";
import NotFound from "@/pages/NotFound";

const P = ({ children }: { children: React.ReactNode }) => <ProtectedRoute>{children}</ProtectedRoute>;

const App = () => (
  <LanguageProvider>
    <AuthProvider>
      <BrowserRouter>
        <OfflineBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/subjects" element={<P><Subjects /></P>} />
          <Route path="/subjects/:subjectId/quizzes" element={<P><SubjectQuizzes /></P>} />
          <Route path="/quiz/:quizId" element={<P><Quiz /></P>} />
          <Route path="/games" element={<P><Games /></P>} />
          <Route path="/leaderboard" element={<P><Leaderboard /></P>} />
          <Route path="/profile" element={<P><Profile /></P>} />
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/ai-tutor" element={<P><AITutor /></P>} />
          <Route path="/teacher" element={<P><TeacherDashboard /></P>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AgentChatbot />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  </LanguageProvider>
);

export default App;
