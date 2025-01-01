import { RPMData } from '../types';

export function loadRPMData(date: string): RPMData {
  const stored = localStorage.getItem(`rpm-${date}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    date,
    captureItems: [],
    goals: []
  };
}

export function saveRPMData(data: RPMData): void {
  if (!data.date) {
    console.error('No date provided for RPM data');
    return;
  }
  localStorage.setItem(`rpm-${data.date}`, JSON.stringify(data));
}

export function loadAllRPMData(): Record<string, RPMData> {
  const data: Record<string, RPMData> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('rpm-')) {
      const stored = localStorage.getItem(key);
      if (stored) {
        data[key.replace('rpm-', '')] = JSON.parse(stored);
      }
    }
  }
  return data;
}

export function saveAllRPMData(data: Record<string, RPMData>): void {
  // Clear existing RPM data
  clearRPMData();
  // Save new data
  Object.entries(data).forEach(([date, rpmData]) => {
    localStorage.setItem(`rpm-${date}`, JSON.stringify(rpmData));
  });
}

export function clearRPMData(): void {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('rpm-')) {
      keys.push(key);
    }
  }
  keys.forEach(key => localStorage.removeItem(key));
}

export function getAvailableDates(currentDate: Date): { prevDate: Date | null; nextDate: Date | null } {
  try {
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const allDates: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('rpm-')) {
        const dateStr = key.replace('rpm-', '');
        // Validate the date string before adding it
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          allDates.push(dateStr);
        }
      }
    }
    
    if (allDates.length === 0) {
      return { prevDate: null, nextDate: null };
    }

    allDates.sort();
    const currentIndex = allDates.indexOf(currentDateStr);
    
    return {
      prevDate: currentIndex > 0 ? new Date(allDates[currentIndex - 1] + 'T00:00:00Z') : null,
      nextDate: currentIndex < allDates.length - 1 ? new Date(allDates[currentIndex + 1] + 'T00:00:00Z') : null
    };
  } catch (error) {
    console.error('Error getting available dates:', error);
    return { prevDate: null, nextDate: null };
  }
}
