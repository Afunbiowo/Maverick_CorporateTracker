export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    createdAt: Date;
    createdBy: string;
    completedAt?: Date;
    deadline?: Date;
    priority?: 'Low' | 'Medium' | 'High';
  }