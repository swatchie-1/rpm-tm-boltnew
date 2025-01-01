import React from 'react';
import { Calendar, Home, Undo2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { LoginPopup } from './auth/LoginPopup';
import { GoogleCalendarSync } from './GoogleCalendarSync';
import "react-datepicker/dist/react-datepicker.css";

interface HeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  onHomeClick: () => void;
  onUndo: () => void;
  canUndo: boolean;
  children?: React.ReactNode;
  schedules: Schedule[];
}

export const Header: React.FC<HeaderProps> = ({ 
  date, 
  onDateChange, 
  onHomeClick,
  onUndo,
  canUndo,
  children,
  schedules
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm p-2 sm:p-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-teal-700 text-center sm:text-left whitespace-normal">
            RPM for {date.toLocaleDateString()}
          </h1>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {children}
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-full transition-colors ${
                canUndo 
                  ? 'hover:bg-gray-100 text-teal-600' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Undo last action"
            >
              <Undo2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Calendar className="w-6 h-6 text-teal-600" />
            </button>
            <button
              onClick={onHomeClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Home className="w-6 h-6 text-teal-600" />
            </button>
            <GoogleCalendarSync schedules={schedules} />
            <LoginPopup />
          </div>
        </div>
      </div>
      {isCalendarOpen && (
        <div className="absolute top-16 right-4 z-50">
          <DatePicker
            selected={date}
            onChange={(date: Date) => {
              onDateChange(date);
              setIsCalendarOpen(false);
            }}
            inline
          />
        </div>
      )}
    </header>
  );
};
