// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AIProvider } from './context/AIContext';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GenAI from './components/pages/GenAI';
import InvoiceDetail from './components/pages/InvoiceDetail'; // Make sure this path is correct
import Data from './components/pages/Data';
import Users from './components/pages/Users';
import Admin from './components/pages/Admin';
import Billing from './components/pages/Billing';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AIProvider>
          <div className="flex h-screen bg-[#f8fafc]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/gen-ai" element={<GenAI />} />
                  
                  {/* === THIS IS THE FIX === */}
                  <Route path="/invoice/:id" element={<InvoiceDetail />} />
                  
                  <Route path="/data" element={<Data />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/billing" element={<Billing />} />
                </Routes>
              </main>
            </div>
          </div>
        </AIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;