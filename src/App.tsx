import React from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ClearDatabase } from './components/ClearDatabase';
import { SyncButtons } from './components/SyncButtons';
import { CaptureBox } from './components/CaptureBox';
import { GoalTable } from './components/GoalTable';
import { useRPMData } from './hooks/useRPMData';
import { useRPMHandlers } from './hooks/useRPMHandlers';
import { getSchedules } from './utils/scheduleStorage';

export default function App() {
  const [date, setDate] = React.useState(new Date());
  const { data, updateData, handleUndo, canUndo, refresh } = useRPMData(date);
  const { draggedItem, handlers } = useRPMHandlers(date, data, updateData);
  const [schedules, setSchedules] = React.useState(getSchedules());

  React.useEffect(() => {
    setSchedules(getSchedules());
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleClearDatabase = () => {
    setDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        date={date}
        onDateChange={handleDateChange}
        onHomeClick={() => setDate(handlers.handleHomeClick())}
        onUndo={handleUndo}
        canUndo={canUndo}
        schedules={schedules}
      >
        <Navigation currentDate={date} onNavigate={setDate} />
        <SyncButtons onSync={refresh} />
        <ClearDatabase onClear={handleClearDatabase} />
      </Header>
      <main className="container mx-auto px-0">
        <div className="flex flex-col md:flex-row gap-1 p-1">
          <div className="w-full md:w-60 shrink-0">
            <CaptureBox
              items={data.captureItems}
              onItemAdd={handlers.handleCaptureAdd}
              onItemDelete={handlers.handleCaptureDelete}
              onItemDragStart={handlers.handleCaptureDragStart}
              onItemDragEnd={handlers.handleCaptureDragEnd}
              currentDate={date}
            />
          </div>
          <div className="flex-1 min-w-0">
            <GoalTable
              goals={data.goals}
              onGoalUpdate={handlers.handleGoalUpdate}
              onGoalDelete={handlers.handleGoalDelete}
              onNewGoal={handlers.handleNewGoal}
              onPlanNextDay={() => setDate(handlers.handlePlanNextDay())}
              onDrop={handlers.handleGoalDrop}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
