import React from 'react';
import { X, Briefcase, ArrowRight } from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  closeSidebar, 
  menuItems, 
  activeTab, 
  setActiveTab, 
  config 
}) {
  return (
    <>
      {/* 1. MOBILE OVERLAY (Dark background when menu is open) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* 2. SLIDING SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        {/* Header Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${config.primaryColor} mr-3 text-white`}>
              <Briefcase size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-gray-800">{config.appName}</h1>
          </div>
          {/* Close Button (Mobile Only) */}
          <button onClick={closeSidebar} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) closeSidebar(); // Close on click for mobile
                }}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? `${config.primaryColor} text-white shadow-lg` 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`relative z-10 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
                  <Icon size={config.sidebarIconSize} />
                </span>
                <span className="relative z-10 ml-3 font-medium text-sm">{item.label}</span>
                
                {/* Active Indicator Arrow */}
                {isActive && <ArrowRight size={16} className="relative z-10 ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
              {config.userName}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">Current User</p>
              <p className="text-xs text-gray-500 truncate">Admin Access</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}