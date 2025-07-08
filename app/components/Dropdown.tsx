'use client';

import { useState } from 'react';

interface DropdownProps {
  position: 'above' | 'below';
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export default function Dropdown({ position, trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {trigger}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeDropdown}
          />
          
          {/* Dropdown content */}
          <div 
            className={`absolute z-20 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg ${
              position === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            <div className="p-4">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
}