
import React from 'react';

const LaunchScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white animate-fade-in">
      <svg className="w-24 h-24 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6M9 7h6"></path></svg>
      <h1 className="text-4xl font-bold mb-2 tracking-tight">The Architect's Dashboard</h1>
      <p className="text-lg text-blue-200">Systematic Excellence in Teacher Observation.</p>
      
      <div className="absolute bottom-16 flex flex-col items-center justify-center space-y-3">
         <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm text-blue-300">Loading initial data...</span>
      </div>
    </div>
  );
};

export default LaunchScreen;