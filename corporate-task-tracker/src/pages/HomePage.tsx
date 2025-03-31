import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import TaskColumn from '../components/TaskColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks } = useTasks();

  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Corporate Task Tracker
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/add-task')}
        >
          Add New Task
        </Button>
      </Box>

      <DndProvider backend={HTML5Backend}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TaskColumn status="Pending" tasks={pendingTasks} />
          <TaskColumn status="In Progress" tasks={inProgressTasks} />
          <TaskColumn status="Completed" tasks={completedTasks} />
        </Box>
      </DndProvider>
    </Container>
  );
};

export default HomePage;