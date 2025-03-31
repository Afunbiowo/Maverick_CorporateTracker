import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { Box, Button, Container, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTask } = useTasks();
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    deadline: null as Date | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        ...(taskData.deadline && { deadline: taskData.deadline }),
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Task
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Task Title"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          />
          
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          />
          
          <TextField
            select
            label="Priority"
            value={taskData.priority}
            onChange={(e) => setTaskData({ 
              ...taskData, 
              priority: e.target.value as 'Low' | 'Medium' | 'High' 
            })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Deadline (optional)"
              value={taskData.deadline}
              onChange={(newValue) => setTaskData({ ...taskData, deadline: newValue })}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Create Task
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddTaskPage;