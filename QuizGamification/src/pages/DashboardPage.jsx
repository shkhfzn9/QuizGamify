// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import NavTabs from '../components/common/NavTabs';
import StatsCards from '../components/dashboard/StatsCards';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import Suggestions from '../components/dashboard/Suggestions';
import { useUserData } from '../hooks/useUserData';
import PageLoader from '../components/ui/PageLoader';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ChatWindow from '../components/chatbot/ChatWindow';

const DashboardPage = () => {
  const { userData, loading } = useUserData();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (loading) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="dashboard" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <StatsCards userData={userData} />
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <PerformanceChart />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recommended For You
            </h3>
            <Suggestions />
          </div>
        </div>
      </main>

      {/* Chat Trigger Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 
                   text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                   flex items-center justify-center group hover:scale-105 z-40"
        title="Open AI Assistant"
      >
        <svg 
          className="w-6 h-6 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default DashboardPage;