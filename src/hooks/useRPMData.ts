import { useState, useEffect } from 'react';
import { RPMData } from '../types';
import { loadRPMData, saveRPMData } from '../utils/storage';
import { useUndoHistory } from './useUndoHistory';

export function useRPMData(date: Date) {
  const [data, setData] = useState<RPMData>(() => {
    const dateStr = date.toISOString().split('T')[0];
    return loadRPMData(dateStr);
  });
  const { pushToHistory, undo, canUndo } = useUndoHistory();

  useEffect(() => {
    const dateStr = date.toISOString().split('T')[0];
    const newData = loadRPMData(dateStr);
    setData(newData);
  }, [date]);

  useEffect(() => {
    if (data) {
      saveRPMData(data);
    }
  }, [data]);

  const updateData = (newData: RPMData) => {
    pushToHistory(data);
    setData(newData);
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setData(previousState);
    }
  };

  const refresh = () => {
    const dateStr = date.toISOString().split('T')[0];
    const newData = loadRPMData(dateStr);
    setData(newData);
  };

  return { data, updateData, handleUndo, canUndo, refresh };
}
