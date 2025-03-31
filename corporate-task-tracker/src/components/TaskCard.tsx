import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getDuration = () => {
    if (task.status === 'Completed' && task.completedAt) {
      const duration = formatDistanceToNow(new Date(task.completedAt), {
        addSuffix: false
      });
      return `Completed in ${duration}`;
    }
    return null;
  };

  return (
    <Card
      ref={drag}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="h3">
            {task.title}
          </Typography>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {task.description}
        </Typography>
        
        {task.priority && (
          <Chip
            label={task.priority}
            color={getPriorityColor()}
            size="small"
            sx={{ mr: 1 }}
          />
        )}
        
        <Typography variant="caption" color="text.secondary">
          Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
        </Typography>
        
        {task.deadline && (
          <Typography variant="caption" color="text.secondary" display="block">
            Deadline: {format(new Date(task.deadline), 'MMM dd, yyyy')}
          </Typography>
        )}
        
        {getDuration() && (
          <Typography variant="caption" color="text.secondary" display="block">
            {getDuration()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;