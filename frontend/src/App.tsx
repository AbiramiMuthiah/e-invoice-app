import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from "./components/Topbar";
import React from 'react';
import './styles/globals.css';
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Data from "./components/pages/Data";
import GenAI from "./components/pages/GenAI";
import Users from "./components/pages/Users";
import Billing from "./components/pages/Billing";
import Admin from "./components/pages/Admin";
import { Toaster } from "./components/ui/sonner";
import { AIProvider } from "./context/AIContext";
import { AuthProvider } from "./context/AuthContext";
import InvoiceGenerator from './components/InvoiceGenerator';

function App() {
  console.log('App component is loading!'); // Check browser console for this

  return (
    <Router>
      <AuthProvider>
        <AIProvider>
          <div className="min-h-screen bg-[#f8fafc]">
            <Topbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/data" element={<Data />} />
                  <Route path="/gen-ai" element={<GenAI />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </div>
        </AIProvider>
      </AuthProvider>
    </Router>
    
  );
}

export default App;
