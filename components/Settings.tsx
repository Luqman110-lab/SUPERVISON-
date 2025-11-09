
import React, { useRef } from 'react';
import * as db from '../services/db';
import { APP_VERSION } from '../constants';

interface SettingsProps {
    refreshData: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const Settings: React.FC<SettingsProps> = ({ refreshData, showToast }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBackup = async () => {
        try {
            const jsonData = await db.exportData();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Broadway_Backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Data backed up successfully.', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to back up data.', 'error');
        }
    };
    
    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const jsonString = e.target?.result as string;
                    if(window.confirm('Are you sure you want to restore data? This will add data from the backup file to your current data.')){
                        const result = await db.importData(jsonString);
                        showToast(`Restored ${result.teachers} teachers and ${result.observations} observations.`, 'success');
                        refreshData();
                    }
                } catch (error) {
                     console.error(error);
                     showToast('Failed to restore data. Invalid file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    const handleClearData = async () => {
        const confirmation1 = prompt("This will permanently delete all data. This action CANNOT be undone. Type 'DELETE' to confirm.");
        if (confirmation1 === 'DELETE') {
            const confirmation2 = prompt("Final confirmation. Type 'DELETE ALL DATA' to proceed.");
            if (confirmation2 === 'DELETE ALL DATA') {
                try {
                    await db.clearAllData();
                    showToast('All data has been cleared.', 'success');
                    refreshData();
                } catch (error) {
                    console.error(error);
                    showToast('Failed to clear data.', 'error');
                }
            } else {
                 showToast('Clear data operation cancelled.', 'error');
            }
        } else {
             showToast('Clear data operation cancelled.', 'error');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Data Management</h2>
                <div className="space-y-4">
                    <button onClick={handleBackup} className="w-full text-left bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Backup All Data
                        <p className="font-normal text-sm">Export all teachers and observations to a JSON file.</p>
                    </button>
                    <button onClick={handleRestoreClick} className="w-full text-left bg-success hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Restore from Backup
                        <p className="font-normal text-sm">Import data from a JSON backup file.</p>
                    </button>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-danger">
                 <h2 className="text-xl font-bold text-danger mb-4">Danger Zone</h2>
                 <button onClick={handleClearData} className="w-full text-left bg-danger hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Clear All Data
                    <p className="font-normal text-sm">Permanently delete all teachers and observations from this device.</p>
                 </button>
            </div>
             <div className="text-center text-gray-500 text-sm mt-8">
                <p>The Architect's Dashboard | Version {APP_VERSION}</p>
                <p>Broadway Nursery & Primary School</p>
            </div>
        </div>
    );
};

export default Settings;