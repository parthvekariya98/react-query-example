import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { queryClient } from './App';

const baseURL = 'https://65a1f8f142ecd7d7f0a706e3.mockapi.io/';

const fetchTasks = async () => {
  const response = await axios.get(`${baseURL}/tasks`);
  return response.data;
};

const addTask = async (newTodo) => {
  const response = await axios.post(`${baseURL}/tasks`, newTodo);
  return response.data;
};

const deleteTask = async (id) => {
  await axios.delete(`${baseURL}/tasks/${id}`);
};

const TaskList = () => {
  const { data: tasks, isLoading, isError } = useQuery('tasks', fetchTasks);

  const addTaskMutation = useMutation(addTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const deleteTaskMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTaskMutation.mutateAsync({
      title: newTaskTitle,
      completed: false,
    });
    setNewTaskTitle('');
  };

  const handleDeleteTask = async (id) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Task List</h1>
      <input
        type="text"
        placeholder="Add new task"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;