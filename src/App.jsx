import React, { useState } from 'react';
import { 
  PieChart, 
  MessageSquare, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Send, 
  DollarSign, 
  Minimize2,
  LogOut,
  User
} from 'lucide-react';
import ChatWidget from './ChatWidget';
import Sidebar from './Sidebar';

/* =========================================
   1. CONFIGURATION
   ========================================= */
const CONFIG = {
  appName: "BlueStarAI",
  botName: "Leadgenbot",
  userName: "nathangillespie",
  primaryColor: "bg-indigo-600",
  secondaryColor: "text-indigo-600",
  sidebarIconSize: 20,
  
  // 1. SIDEBAR ITEMS (Removed Settings from here)
  sidebarMenu: [
    { id: 'dashboard', label: 'Investment Dashboard', icon: PieChart },
    { id: 'leads', label: 'Active Leads', icon: Users },
    { id: 'opportunities', label: 'Capital Opportunities', icon: DollarSign },
  ],

  // 2. PROFILE DROPDOWN ITEMS (New Section)
  profileMenu: [
    { id: 'settings', label: 'Platform Settings', icon: Settings },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'logout', label: 'Sign Out', icon: LogOut },
  ],

  botScript: {
    start: {
      text: "Welcome to BlueStarAI. I'm your AI analyst. Are you looking to raise capital or deploy capital today?",
      options: [
        { label: "Raise Capital", next: 'raise_amt' },
        { label: "Deploy Capital", next: 'deploy_sector' },
      ]
    },
    raise_amt: {
      text: "Understood. What is your target funding round size?",
      options: [
        { label: "< $1M (Seed)", next: 'capture_email' },
        { label: "$1M - $10M (Series A)", next: 'capture_email' },
        { label: "$10M+ (Growth)", next: 'capture_email' },
      ]
    },
    deploy_sector: {
      text: "Great. Which sector interests you most?",
      options: [
        { label: "FinTech", next: 'capture_email' },
        { label: "HealthTech", next: 'capture_email' },
        { label: "SaaS", next: 'capture_email' },
      ]
    },
    capture_email: {
      text: "I have identified 3 potential matches. Please enter your email to view the confidential prospectus.",
      input: true, 
      next: 'finish'
    },
    finish: {
      text: "Thank you. A senior partner will contact you shortly with the data room access.",
      options: [{ label: "Start Over", next: 'start' }]
    }
  }
};

/* =========================================
   2. MAIN APP COMPONENT
   ========================================= */
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false); // <--- NEW STATE FOR DROPDOWN
  
  // Helper to find the current page title from BOTH lists
  const getPageTitle = () => {
    const sidebarItem = CONFIG.sidebarMenu.find(m => m.id === activeTab);
    const profileItem = CONFIG.profileMenu.find(m => m.id === activeTab);
    return sidebarItem?.label || profileItem?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden relative">
      
      {/* SIDEBAR (Now uses sidebarMenu) */}
      <Sidebar 
        isOpen={isSidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        menuItems={CONFIG.sidebarMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={CONFIG}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="mr-4 p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            {/* Dynamic Title */}
            <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
          </div>

          {/* RIGHT SIDE: USER PROFILE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
                {CONFIG.userName}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-700">John Doe</p>
                <p className="text-[10px] text-gray-500">Admin</p>
              </div>
            </button>

            {/* THE DROPDOWN MENU */}
            {isProfileOpen && (
              <>
                {/* Invisible backdrop to close menu when clicking outside */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setProfileOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                    {CONFIG.profileMenu.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setProfileOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            activeTab === item.id ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <Icon size={16} className="mr-2" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Only show Stats on Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard title="Total Capital Deployed" value="$4.2M" trend="+12%" />
              <StatCard title="Active Leads" value="142" trend="+5%" />
              <StatCard title="Pending Deals" value="8" trend="Neutral" />
            </div>
          )}

          {/* DYNAMIC CONTENT CONTAINER */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-dashed">
            {activeTab === 'settings' ? (
              <div className="text-center">
                <Settings size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-gray-900">Platform Settings</h3>
                <p>Manage API Keys, Team Members, and Billing here.</p>
              </div>
            ) : (
              <p>[Main Content Area for {activeTab}]</p>
            )}
          </div>
        </div>
      </main>

      <ChatWidget 
        config={CONFIG.botScript} 
        botName={CONFIG.botName}
        primaryColor={CONFIG.primaryColor}
      />
    </div>
  );
}

function StatCard({ title, value, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}