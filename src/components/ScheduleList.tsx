import React from 'react';
import { X } from 'lucide-react';
import { Schedule } from '../types';
import { deleteSchedule } from '../utils/scheduleStorage';

interface ScheduleListProps {
  schedules: Schedule[];
  currentDate: Date;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, currentDate }) => {
  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.scheduledFor);
    return scheduleDate.toDateString() === currentDate.toDateString();
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled item?')) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-teal-700 mb-4">Schedule</h2>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-600">Item</th>
              <th className="text-left py-2 text-gray-600">Time</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No scheduled items for this date
                </td>
              </tr>
            ) : (
              filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="border-b last:border-b-0 group">
                  <td className="py-2">{schedule.text}</td>
                  <td className="py-2">
                    {new Date(schedule.scheduledFor).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                      title="Delete schedule"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
