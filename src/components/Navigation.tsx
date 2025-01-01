import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvailableDates } from '../utils/storage';

interface NavigationProps {
  currentDate: Date;
  onNavigate: (date: Date) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentDate, onNavigate }) => {
  const { prevDate, nextDate } = getAvailableDates(currentDate);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => prevDate && onNavigate(prevDate)}
        disabled={!prevDate}
        className={`p-2 rounded-full transition-colors ${
          prevDate ? 'hover:bg-gray-100 text-teal-600' : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Previous day"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => nextDate && onNavigate(nextDate)}
        disabled={!nextDate}
        className={`p-2 rounded-full transition-colors ${
          nextDate ? 'hover:bg-gray-100 text-teal-600' : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Next day"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
