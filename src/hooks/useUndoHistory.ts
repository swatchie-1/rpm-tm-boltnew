import { useState } from 'react';
import { RPMData } from '../types';

const MAX_HISTORY = 50;

export function useUndoHistory() {
  const [history, setHistory] = useState<RPMData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const pushToHistory = (data: RPMData) => {
    const newHistory = [...history.slice(0, currentIndex + 1), data].slice(-MAX_HISTORY);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const canUndo = currentIndex > 0;

  const undo = (): RPMData | null => {
    if (!canUndo) return null;
    const previousState = history[currentIndex - 1];
    setCurrentIndex(currentIndex - 1);
    return previousState;
  };

  return { pushToHistory, undo, canUndo };
}
