import React, { createContext, useContext, useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const tasksRef = collection(firestore, 'tasks');
    const q = query(tasksRef, where('createdBy', '==', currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function addTask(task: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) {
    if (!currentUser) throw new Error('User not authenticated');
    
    await addDoc(collection(firestore, 'tasks'), {
      ...task,
      createdAt: new Date(),
      createdBy: currentUser.uid,
      status: 'Pending'
    });
  }

  async function updateTaskStatus(taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') {
    await updateDoc(doc(firestore, 'tasks', taskId), {
      status: newStatus,
      ...(newStatus === 'Completed' && { completedAt: new Date() })
    });
  }

  async function deleteTask(taskId: string) {
    await deleteDoc(doc(firestore, 'tasks', taskId));
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}