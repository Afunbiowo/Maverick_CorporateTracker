import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TaskCard from './TaskCard';
import { Task } from '../types';
import { useDrop } from 'react-dnd';
import { useTasks } from '../contexts/TaskContext';

interface TaskColumnProps {
  status: 'Pending' | 'In Progress' | 'Completed';
  tasks: Task[];
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
  const { updateTaskStatus } = useTasks();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => {
      updateTaskStatus(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getStatusColor = () => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'In Progress': return '#2196f3';
      case 'Completed': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <Paper
      ref={drop}
      sx={{
        flex: 1,
        p: 2,
        backgroundColor: isOver ? '#f5f5f5' : '#ffffff',
        minHeight: '70vh',
        borderTop: `4px solid ${getStatusColor()}`,
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2, color: getStatusColor() }}>
        {status} ({tasks.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </Paper>
  );
};

export default TaskColumn;