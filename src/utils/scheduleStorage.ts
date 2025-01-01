import { Schedule } from '../types';

const SCHEDULE_STORAGE_KEY = 'rpm-schedules';
const subscribers = new Set<(schedules: Schedule[]) => void>();

export function loadSchedules(): Schedule[] {
  const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveSchedule(schedule: Omit<Schedule, 'id' | 'createdAt'>): Schedule {
  const schedules = loadSchedules();
  const newSchedule: Schedule = {
    id: crypto.randomUUID(),
    itemId: schedule.itemId,
    text: schedule.text,
    scheduledFor: schedule.scheduledFor,
    createdAt: new Date()
  };
  
  schedules.push(newSchedule);
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
  
  notifySubscribers();
  
  return newSchedule;
}

export function deleteSchedule(id: string): void {
  const schedules = loadSchedules();
  const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(updatedSchedules));
  notifySubscribers();
}

export function getSchedules(): Schedule[] {
  return loadSchedules().sort((a, b) => 
    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );
}

export function subscribeToSchedules(callback: (schedules: Schedule[]) => void): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers() {
  const schedules = getSchedules();
  subscribers.forEach(callback => callback(schedules));
}
