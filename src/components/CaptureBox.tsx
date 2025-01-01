import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TodoItem, Schedule } from '../types';
import { ScheduleList } from './ScheduleList';
import { getSchedules, subscribeToSchedules } from '../utils/scheduleStorage';

interface CaptureBoxProps {
  items: TodoItem[];
  onItemAdd: (text: string) => void;
  onItemDelete: (id: string) => void;
  onItemDragStart: (item: TodoItem) => void;
  onItemDragEnd: () => void;
  currentDate: Date;
}

export const CaptureBox: React.FC<CaptureBoxProps> = ({
  items,
  onItemAdd,
  onItemDelete,
  onItemDragStart,
  onItemDragEnd,
  currentDate
}) => {
  const [inputValue, setInputValue] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    // Initial load
    setSchedules(getSchedules());

    // Subscribe to schedule updates
    const unsubscribe = subscribeToSchedules((updatedSchedules) => {
      setSchedules(updatedSchedules);
    });

    return () => unsubscribe();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onItemAdd(inputValue.trim());
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && items.length > 0) {
      onItemDelete(items[items.length - 1].id);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: TodoItem) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    onItemDragStart(item);
  };

  return (
    <div className="space-y-16">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-teal-700 mb-4">Capture</h2>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 group cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={onItemDragEnd}
            >
              <span className="text-gray-500">{index + 1}.</span>
              <span className="flex-1">{item.text}</span>
              <button
                onClick={() => onItemDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter..."
            className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <ScheduleList schedules={schedules} currentDate={currentDate} />
    </div>
  );
}
