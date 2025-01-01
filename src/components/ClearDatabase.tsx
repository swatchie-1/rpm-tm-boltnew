import React from 'react';
import { Trash2 } from 'lucide-react';
import { clearRPMData } from '../utils/storage';

interface ClearDatabaseProps {
  onClear: () => void;
}

export const ClearDatabase: React.FC<ClearDatabaseProps> = ({ onClear }) => {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all RPM data? This cannot be undone.')) {
      clearRPMData();
      onClear();
    }
  };

  return (
    <button
      onClick={handleClear}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-600"
      title="Clear all data"
    >
      <Trash2 className="w-6 h-6" />
    </button>
  );
};
