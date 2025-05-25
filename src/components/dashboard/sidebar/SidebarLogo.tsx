
import React from 'react';

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">P</span>
      </div>
      <span className="font-bold text-lg">ProLawh</span>
    </div>
  );
}
