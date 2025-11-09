
import React, { useState } from 'react';
import { Page } from '../types';
import { DashboardIcon, NewObservationIcon, ObservationsIcon, TeachersIcon, ReportsIcon, SettingsIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, MeetingIcon } from './common/Icons';

interface LayoutProps {
    children: React.ReactNode;
    page: Page;
    setPage: (page: Page) => void;
    onNewObservation: () => void;
    onNewMeeting: () => void;
}

const NavItemMobile: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full h-full text-center transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const Layout: React.FC<LayoutProps> = ({ children, page, setPage, onNewObservation, onNewMeeting }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'observations', label: 'Observations', icon: <ObservationsIcon /> },
        { id: 'teachers', label: 'Teachers', icon: <TeachersIcon /> },
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
    ];
    
    const mobileNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'observations', label: 'Observations', icon: <ObservationsIcon /> },
        { id: 'new_observation', label: 'New', icon: <NewObservationIcon />, special: true },
        { id: 'teachers', label: 'Teachers', icon: <TeachersIcon /> },
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex fixed top-0 left-0 h-full bg-white shadow-lg z-30 flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-60'}`}>
                <div className="flex items-center h-[61px] px-4 bg-gradient-to-br from-primary to-primary-dark shrink-0">
                    <svg className="w-8 h-8 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6M9 7h6"></path></svg>
                    {!isSidebarCollapsed && <h1 className="text-xl font-bold text-white ml-2 whitespace-nowrap">Architect's Dash</h1>}
                </div>
                
                <nav className="flex flex-col space-y-2 w-full p-2 flex-grow">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setPage(item.id as Page)}
                            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${page === item.id ? 'text-white bg-primary' : 'text-gray-600 hover:text-primary hover:bg-primary-subtle'}`}
                            title={item.label}
                        >
                            {item.icon}
                            {!isSidebarCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-2 space-y-2">
                    <button
                        onClick={onNewObservation}
                        className={`w-full flex items-center p-3 rounded-lg shadow text-white bg-primary hover:bg-primary-dark ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        title="New Observation"
                    >
                        <NewObservationIcon />
                        {!isSidebarCollapsed && <span className="ml-3 font-bold">New Observation</span>}
                    </button>
                    <button
                        onClick={onNewMeeting}
                        className={`w-full flex items-center p-3 rounded-lg text-primary bg-primary-subtle hover:bg-blue-200 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        title="New Meeting"
                    >
                        <MeetingIcon />
                        {!isSidebarCollapsed && <span className="ml-3 font-medium">New Meeting</span>}
                    </button>
                </div>
                
                <div className="border-t p-2 flex items-center">
                    <button onClick={() => setPage('settings')} className={`p-3 rounded-lg flex-grow flex items-center ${page === 'settings' ? 'text-primary bg-primary-subtle' : 'text-gray-500 hover:text-primary'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Settings">
                        <SettingsIcon />
                        {!isSidebarCollapsed && <span className="ml-3 font-medium">Settings</span>}
                    </button>
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-gray-500 hover:text-primary rounded-lg">
                        {isSidebarCollapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
                    </button>
                </div>
            </aside>

            <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-60'}`}>
                <header className="bg-gradient-to-br from-primary to-primary-dark shadow-md sticky top-0 z-20 md:hidden">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6M9 7h6"></path></svg>
                            <h1 className="text-xl md:text-2xl font-bold text-white ml-2">Architect's Dashboard</h1>
                        </div>
                        <button onClick={() => setPage('settings')} className="text-gray-200 hover:text-white">
                            <SettingsIcon />
                        </button>
                    </div>
                </header>
                
                <main className="flex-grow container mx-auto p-4 md:p-6 pb-24">
                    {children}
                </main>
                
                <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 h-16 md:hidden">
                    <div className="flex justify-around h-full">
                        {mobileNavItems.map(item => {
                            if (item.special) {
                                return (
                                    <div key={item.id} className="relative w-1/5">
                                        <button
                                            onClick={onNewObservation}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary hover:bg-primary-dark rounded-full shadow-lg text-white flex items-center justify-center"
                                        >
                                            <NewObservationIcon />
                                        </button>
                                    </div>
                                );
                            }
                            return (
                               <div key={item.id} className="w-1/5">
                                     <NavItemMobile
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={page === item.id}
                                    onClick={() => setPage(item.id as Page)}
                                />
                               </div>
                            );
                        })}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
