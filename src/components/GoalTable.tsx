import React, { useState } from 'react';
import { X, Check, Trash2, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { Goal, TodoItem } from '../types';
import { saveSchedule } from '../utils/scheduleStorage';

interface GoalTableProps {
  goals: Goal[];
  onGoalUpdate: (goal: Goal) => void;
  onGoalDelete: (id: string) => void;
  onNewGoal: () => void;
  onPlanNextDay: () => void;
  onDrop: (goalId: string) => void;
}

export const GoalTable: React.FC<GoalTableProps> = ({
  goals,
  onGoalUpdate,
  onGoalDelete,
  onNewGoal,
  onPlanNextDay,
  onDrop
}) => {
  const [newActionTexts, setNewActionTexts] = useState<Record<string, string>>({});
  const [schedulingItem, setSchedulingItem] = useState<{ goalId: string; action: TodoItem } | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  const handleDrop = (e: React.DragEvent, goalId: string) => {
    e.preventDefault();
    onDrop(goalId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleNewAction = (goalId: string, text: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && text.trim()) {
      const newAction: TodoItem = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false
      };
      onGoalUpdate({
        ...goal,
        massiveActions: [...goal.massiveActions, newAction]
      });
      setNewActionTexts(prev => ({ ...prev, [goalId]: '' }));
    }
  };

  const handleSchedule = async (goalId: string, action: TodoItem) => {
    if (!scheduledDate) return;

    try {
      saveSchedule({
        itemId: action.id,
        text: action.text,
        scheduledFor: scheduledDate
      });
      
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        const updatedActions = goal.massiveActions.map(a =>
          a.id === action.id ? { ...a, scheduled: true } : a
        );
        onGoalUpdate({ ...goal, massiveActions: updatedActions });
      }
    } catch (error) {
      console.error('Failed to schedule item:', error);
      alert('Failed to schedule item');
    }

    setSchedulingItem(null);
    setScheduledDate(null);
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="hidden md:table-cell p-2 text-left text-sm font-semibold text-gray-600 w-3/7">Massive Action Plan</th>

            <th className="md:hidden p-2 text-left text-sm font-semibold text-gray-600 w-2/3">Massive Action Plan</th>
            
            <th className="hidden md:table-cell p-2 text-left text-sm font-semibold text-gray-600 w-2/7">Ultimate Goal</th>
            <th className="md:hidden text-sm font-semibold text-gray-600 w-1/3">Ultimate Goal</th>
            <th className="hidden md:table-cell p-2 text-left text-sm font-semibold text-gray-600 w-2/7">Ultimate Purpose</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => (
            <tr key={goal.id} className="border-t group/row hover:bg-gray-50">
              <td className="p-2 align-top">
                <div className="space-y-2" onDrop={(e) => handleDrop(e, goal.id)} onDragOver={handleDragOver}>
                  {goal.massiveActions.map((action, index) => (
                    <div key={action.id} className="flex items-center gap-2 group">
                      <span className="text-gray-500">{index + 1}.</span>
                      <span 
                        className={`flex-1 p-2 rounded ${
                          action.scheduled ? 'bg-green-50' : ''
                        } ${action.completed ? 'line-through' : ''}`}
                      >
                        {action.text}
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <input
                          type="text"
                          value={action.duration || ''}
                          onChange={(e) => {
                            const updatedActions = [...goal.massiveActions];
                            updatedActions[index] = { ...action, duration: e.target.value };
                            onGoalUpdate({ ...goal, massiveActions: updatedActions });
                          }}
                          className="hidden md:table-cell w-6 p-1 text-sm border border-gray-200 rounded text-center"
                          placeholder="Lev"
                        />
                        <input
                          type="text"
                          value={action.priority || ''}
                          onChange={(e) => {
                            const updatedActions = [...goal.massiveActions];
                            updatedActions[index] = { ...action, priority: e.target.value };
                            onGoalUpdate({ ...goal, massiveActions: updatedActions });
                          }}
                          className="hidden md:table-cell w-12 p-1 text-sm border border-gray-200 rounded text-center"
                          placeholder="Dur"
                        />
                        <input
                          type="text"
                          value={action.level || ''}
                          onChange={(e) => {
                            const updatedActions = [...goal.massiveActions];
                            updatedActions[index] = { ...action, level: e.target.value };
                            onGoalUpdate({ ...goal, massiveActions: updatedActions });
                          }}
                          className="hidden md:table-cell w-6 p-1 text-sm border border-gray-200 rounded text-center"
                          placeholder="Pri"
                        />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setSchedulingItem({ goalId: goal.id, action });
                              setScheduledDate(null);
                            }}
                          >
                            <Calendar className="w-4 h-4 text-teal-500" />
                          </button>
                          <button
                            onClick={() => {
                              const updatedActions = [...goal.massiveActions];
                              updatedActions[index] = {
                                ...action,
                                completed: !action.completed
                              };
                              onGoalUpdate({
                                ...goal,
                                massiveActions: updatedActions
                              });
                            }}
                          >
                            <Check className={`w-4 h-4 ${action.completed ? 'text-green-500' : 'text-gray-400'}`} />
                          </button>
                          <button
                            onClick={() => {
                              onGoalUpdate({
                                ...goal,
                                massiveActions: goal.massiveActions.filter(a => a.id !== action.id)
                              });
                            }}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={newActionTexts[goal.id] || ''}
                    onChange={(e) => setNewActionTexts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNewAction(goal.id, newActionTexts[goal.id] || '');
                      }
                    }}
                    placeholder="Type and press Enter to add action..."
                    className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </td>
              <td className="p-2 align-top">
                <textarea
                  value={goal.ultimateGoal}
                  onChange={(e) => onGoalUpdate({ ...goal, ultimateGoal: e.target.value })}
                  className="w-full h-44 p-2 text-sm border border-gray-200 rounded resize-none"
                  placeholder="What is your ultimate goal?"
                />
              </td>
              <td className="hidden md:table-cell p-2 align-top">
                <textarea
                  value={goal.ultimatePurpose}
                  onChange={(e) => onGoalUpdate({ ...goal, ultimatePurpose: e.target.value })}
                  className="w-full h-44 p-2 text-sm border border-gray-200 rounded resize-none"
                  placeholder="Why is this important to you?"
                />
              </td>
              <td className="hidden lg:block p-2 relative">
                <button
                  onClick={() => onGoalDelete(goal.id)}
                  className="absolute right-2 top-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover/row:opacity-100"
                  title="Delete Goal"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-y-2">
        <button
          onClick={onNewGoal}
          className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Add New Goal
        </button>
        <button
          onClick={onPlanNextDay}
          className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Plan Next Day
        </button>
      </div>

      {schedulingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Schedule Item</h3>
            <p className="mb-4">{schedulingItem.action.text}</p>
            <DatePicker
              selected={scheduledDate}
              onChange={(date) => setScheduledDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              inline
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSchedulingItem(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSchedule(schedulingItem.goalId, schedulingItem.action)}
                disabled={!scheduledDate}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
