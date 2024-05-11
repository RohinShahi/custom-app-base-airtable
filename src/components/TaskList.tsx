"use client";

import { useState } from 'react';
import { Task, updateTaskStatus } from '@/utils/airtable';
import KanbanBoard from './KanbanBoard';

interface TaskListProps {
  initialTasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const handleStatusChange = async (taskId: string, newStatus: 'Todo' | 'In progress' | 'Done') => {
    setLoading(true);
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task['Task ID'] === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
    setLoading(false);
  };

  const renderListView = () => (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task['Task ID']} className="task">
          <h3>{task['Task Name']}</h3>
          <div className="task-details">
            <div>
              <p className="label">Description</p>
              <p>{task.Description}</p>
            </div>
            <div>
              <p className="label">Deadline</p>
              <p>{task.Deadline}</p>
            </div>
            <div>
              <p className="label">Status</p>
              <select
                value={task.Status}
                onChange={(e) => handleStatusChange(task['Task ID'], e.target.value as 'Todo' | 'In progress' | 'Done')}
                className={`status ${getStatusClass(task.Status)}`}
                disabled={loading}
              >
                <option value="Todo">Todo</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Todo':
        return 'status-todo';
      case 'In progress':
        return 'status-in-progress';
      case 'Done':
        return 'status-done';
      default:
        return '';
    }
  };

  return (
    <div>
      <button onClick={() => setView(view === 'list' ? 'kanban' : 'list')}>
        {view === 'list' ? 'Switch to Kanban View' : 'Switch to List View'}
      </button>
      {view === 'list' ? renderListView() : (
        <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
};

export default TaskList;
