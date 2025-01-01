import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { syncWithGoogleCalendar } from '../utils/googleCalendar';
import { Schedule } from '../types';

interface GoogleCalendarSyncProps {
  schedules: Schedule[];
}

export const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ schedules }) => {
  const [showPopupMessage, setShowPopupMessage] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await syncWithGoogleCalendar(schedules, tokenResponse.access_token);
        alert('Successfully synced with Google Calendar!');
      } catch (error) {
        console.error('Failed to sync with Google Calendar:', error);
        alert('Failed to sync with Google Calendar. Please try again.');
      }
    },
    onError: () => {
      alert('Failed to connect to Google Calendar. Please try again.');
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });

  const handleSync = () => {
    try {
      login();
    } catch (error) {
      if (error instanceof Error && error.message.includes('popup')) {
        setShowPopupMessage(true);
        setTimeout(() => setShowPopupMessage(false), 5000);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSync}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Sync with Google Calendar"
      >
        <CalendarIcon className="w-6 h-6 text-blue-500" />
      </button>
      
      {showPopupMessage && (
        <div className="absolute right-0 top-12 w-64 p-3 bg-red-100 text-red-700 rounded-lg shadow-lg text-sm">
          Please allow popups for this site to sync with Google Calendar
        </div>
      )}
    </div>
  );
};
