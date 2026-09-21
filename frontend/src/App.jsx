import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import ClasseDetail from "./pages/ClasseDetail";
import Etudiants from "./pages/Etudiants";
import EtudiantDetail from "./pages/EtudiantDetail";
import Paiements from "./pages/Paiements";
import Aide from "./pages/Aide";
import Parametres from "./pages/Parametres";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
            <Route path="/classes/:id" element={<ProtectedRoute><ClasseDetail /></ProtectedRoute>} />
            <Route path="/etudiants" element={<ProtectedRoute><Etudiants /></ProtectedRoute>} />
            <Route path="/etudiants/:id" element={<ProtectedRoute><EtudiantDetail /></ProtectedRoute>} />
            <Route path="/paiements" element={<ProtectedRoute><Paiements /></ProtectedRoute>} />
            <Route path="/aide" element={<ProtectedRoute><Aide /></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute><Parametres /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
