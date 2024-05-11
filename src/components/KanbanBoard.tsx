"use client";

import React from 'react';
import { Task } from '@/utils/airtable';
import './kanban.css';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: 'Todo' | 'In progress' | 'Done') => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onStatusChange }) => {
  const renderTasks = (status: 'Todo' | 'In progress' | 'Done') => {
    return tasks.filter(task => task.Status === status).map(task => (
      <div key={task['Task ID']} className="kanban-task">
        <h3>{task['Task Name']}</h3>
        <p>{task.Description}</p>
        <p>Deadline: {task.Deadline}</p>
        <select
          value={task.Status}
          onChange={(e) => onStatusChange(task['Task ID'], e.target.value as 'Todo' | 'In progress' | 'Done')}
          className={`status ${status === 'Todo' ? 'status-todo' : status === 'In progress' ? 'status-in-progress' : 'status-done'}`}
        >
          <option value="Todo">Todo</option>
          <option value="In progress">In progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    ));
  };

  return (
    <div className="kanban-board">
      <div className="kanban-column">
        <h2>Todo</h2>
        {renderTasks('Todo')}
      </div>
      <div className="kanban-column">
        <h2>In Progress</h2>
        {renderTasks('In progress')}
      </div>
      <div className="kanban-column">
        <h2>Done</h2>
        {renderTasks('Done')}
      </div>
    </div>
  );
};

export default KanbanBoard;
