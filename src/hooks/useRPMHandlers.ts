import { useState } from 'react';
import { RPMData, TodoItem, Goal } from '../types';

export function useRPMHandlers(date: Date, data: RPMData, updateData: (data: RPMData) => void) {
  const [draggedItem, setDraggedItem] = useState<TodoItem | null>(null);

  const handleHomeClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() !== today.getTime()) {
      const newDate = new Date();
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    }
    return date;
  };

  const handleCaptureAdd = (text: string) => {
    const dateStr = date.toISOString().split('T')[0];
    updateData({
      ...data,
      date: dateStr,
      captureItems: [
        ...data.captureItems,
        { id: crypto.randomUUID(), text, completed: false }
      ]
    });
  };

  const handleCaptureDelete = (id: string) => {
    updateData({
      ...data,
      captureItems: data.captureItems.filter(item => item.id !== id)
    });
  };

  const handleCaptureDragStart = (item: TodoItem) => {
    setDraggedItem(item);
  };

  const handleCaptureDragEnd = () => {
    setDraggedItem(null);
  };

  const handleGoalDrop = (goalId: string) => {
    if (draggedItem) {
      updateData({
        ...data,
        captureItems: data.captureItems.filter(item => item.id !== draggedItem.id),
        goals: data.goals.map(goal => 
          goal.id === goalId 
            ? { ...goal, massiveActions: [...goal.massiveActions, { ...draggedItem, completed: false }] }
            : goal
        )
      });
    }
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
    updateData({
      ...data,
      goals: data.goals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    });
  };

  const handleGoalDelete = (id: string) => {
    updateData({
      ...data,
      goals: data.goals.filter(goal => goal.id !== id)
    });
  };

  const handleNewGoal = () => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      massiveActions: [],
      ultimateGoal: '',
      ultimatePurpose: '',
      level: '',
      duration: '',
      priority: ''
    };
    updateData({
      ...data,
      goals: [...data.goals, newGoal]
    });
  };

  const handlePlanNextDay = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  };

  return {
    draggedItem,
    handlers: {
      handleHomeClick,
      handleCaptureAdd,
      handleCaptureDelete,
      handleCaptureDragStart,
      handleCaptureDragEnd,
      handleGoalDrop,
      handleGoalUpdate,
      handleGoalDelete,
      handleNewGoal,
      handlePlanNextDay
    }
  };
}
