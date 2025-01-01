export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  level?: string;
  duration?: string;
  priority?: string;
  scheduled?: boolean;
}

export interface Goal {
  id: string;
  massiveActions: TodoItem[];
  ultimateGoal: string;
  ultimatePurpose: string;
  level: string;
  duration: string;
  priority: string;
}

export interface RPMData {
  date: string;
  captureItems: TodoItem[];
  goals: Goal[];
}

export interface Schedule {
  id: string;
  itemId: string;
  text: string;
  scheduledFor: Date;
  createdAt: Date;
}
