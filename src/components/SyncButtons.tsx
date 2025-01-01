import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { uploadToSupabase, downloadFromSupabase } from '../utils/supabase';
import { loadAllRPMData, saveAllRPMData } from '../utils/storage';

interface SyncButtonsProps {
  onSync: () => void;
}

export const SyncButtons: React.FC<SyncButtonsProps> = ({ onSync }) => {
  const handleUpload = async () => {
    if (!window.confirm('Upload local data to Supabase? This will overwrite the server data.')) {
      return;
    }

    try {
      const localData = loadAllRPMData();
      await uploadToSupabase(localData);
      alert('Data uploaded successfully!');
      onSync();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload data. Please make sure you are logged in.');
    }
  };

  const handleDownload = async () => {
    if (!window.confirm('Download data from Supabase? This will overwrite your local data.')) {
      return;
    }

    try {
      const serverData = await downloadFromSupabase();
      saveAllRPMData(serverData);
      alert('Data downloaded successfully!');
      onSync();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download data. Please make sure you are logged in.');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleUpload}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-teal-600"
        title="Upload to Supabase"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
      <button
        onClick={handleDownload}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-teal-600"
        title="Download from Supabase"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </div>
  );
}
