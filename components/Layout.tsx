
import React from 'react';

interface LayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - Sources & Notes */}
      <aside className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
