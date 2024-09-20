import React, { useState, useEffect } from 'react';
import './App.css';
import TutorialModal from './TutorialModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPencil } from '@fortawesome/free-solid-svg-icons';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState('all');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 25;

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  useEffect(() => {
    updateFilteredTasks();
  }, [tasks]);

  const updateFilteredTasks = () => {
    const completed = tasks.filter(task => task.completed);
    const pending = tasks.filter(task => !task.completed);

    setCompletedTasks(completed);
    setPendingTasks(pending);
  };

  const handleCreateTask = () => {
    if (newTask.trim() === '') {
      alert('Fill in the field to create a new task.');
      return;
    }
    if (window.confirm(`Are you sure you want to create a new task "${newTask}"?`)) {
      const newTaskData = { title: newTask, completed: false };
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      })
        .then(response => response.json())
        .then(data => {
          const newTasksArray = [data, ...tasks];
          setTasks(newTasksArray);
        });
      setNewTask('');
    }
  };

  const handleTaskUpdate = (task, updates) => {
    const updatedTask = { ...task, ...updates };
    const patchData = {};
    Object.keys(updates).forEach(key => {
      patchData[key] = updatedTask[key];
    });
  
    fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData),
    })
      .then(response => response.json())
      .then(data => setTasks(tasks.map(t => t.id === task.id ? data : t)));
  };

  const handleUpdateTask = (task) => {
    handleTaskUpdate(task, { completed: !task.completed });
  };

  const handleSaveTask = (task) => {
    const newTitle = tasks.find(t => t.id === task.id).title;
    if (newTitle.trim() === '') {
      alert('Task title cannot be empty');
      return;
    }
    if (window.confirm(`Are you sure you want to save the changes to "${newTitle}"?`)) {
      handleTaskUpdate(task, { title: newTitle });
      setEditingTaskId(null);
    }
  };

  const handleSelectTask = (task) => {
    if (selectedTasks.includes(task.id)) {
      setSelectedTasks(selectedTasks.filter(id => id !== task.id));
    } else {
      setSelectedTasks([...selectedTasks, task.id]);
    }
  };

  const handleDeleteSelectedTasks = () => {
    if (selectedTasks.length === 0) {
      alert("You can't delete any tasks without having selected them");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      fetch(`https://jsonplaceholder.typicode.com/todos/${selectedTasks.join(',')}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTasks(tasks.filter(t => !selectedTasks.includes(t.id)));
          setSelectedTasks([]);
        });
    }
  };

  const handleDeleteTask = (task) => {
    if (window.confirm(`Are you sure you want to delete this task?`)) {
      fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTasks(tasks.filter(t => t.id !== task.id));
        });
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
  };

  const handleFilterChange = (filterType) => {
    setTaskFilter(filterType);
    setCurrentPage(1); 
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedTasks = () => {
    const tasksToDisplay = (taskFilter === 'all' ? tasks :
      taskFilter === 'completed' ? completedTasks :
      pendingTasks
    );
  
    if (tasksToDisplay.length === 0) {
      return <p>No tasks found.</p>; 
    }
  
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return tasksToDisplay.slice(startIndex, endIndex);
  };

  return (
    <div className="task-manager">
      <div className='task-manager-header'>
        <h1>Task Manager</h1>
        <div className='createTaskDiv'>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <button className="createButton" onClick={handleCreateTask}>Create Task</button>
        </div>

        <div>
          <button className="tutorial-button" onClick={() => setIsTutorialOpen(true)}>
          Tutorial
          </button>
          <button className="deleteButton" onClick={handleDeleteSelectedTasks}>Delete Selected Tasks</button>
          <button
            className={`editButton ${taskFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Show All Tasks
          </button>
          <button
            className={`editButton ${taskFilter === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Show Completed Tasks
          </button>
          <button
            className={`editButton ${taskFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Show Pending Tasks
          </button>

        </div>
        
        
        
      </div>
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <div className='taskListDiv'>
        <ul>
          {paginatedTasks().map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={selectedTasks.includes(task.id)}
                onChange={() => handleSelectTask(task)}
              />
              {editingTaskId === task.id ? (
                <div>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => {
                      const newTasksArray = tasks.map(t => t.id === task.id ? { ...t, title: e.target.value } : t);
                      setTasks(newTasksArray);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === task.title) {
                        setEditingTaskId(null);
                      } else {
                        handleSaveTask(task);
                      }
                    }}
                  />
                  <button 
                    className='editCancelButton'
                    onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
              ) : (
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
              )}

              <div className='status-buttons'>
                <FontAwesomeIcon
                  icon={faCheck}
                  className='complete-icon'
                  onClick={() => handleUpdateTask(task)}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className='delete-icon'
                  onClick ={() => handleDeleteTask(task)}
                />
                <FontAwesomeIcon
                  icon={faPencil}
                  className='edit-icon'
                  onClick={() => handleEditTask(task)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pagination">
        <div>
            <h2>
              Showing {(currentPage - 1) * tasksPerPage + 1} to {(Math.min(currentPage * tasksPerPage, 
              taskFilter === 'all' ? tasks.length : 
              taskFilter === 'completed' ? completedTasks.length : 
              pendingTasks.length))} of {(taskFilter === 'all' ? tasks.length : 
              taskFilter === 'completed' ? completedTasks.length : 
              pendingTasks.length)} total tasks
            </h2>
          </div>
          {Array(Math.ceil((taskFilter === 'all' ? tasks.length : 
            taskFilter === 'completed' ? completedTasks.length : 
            pendingTasks.length) / tasksPerPage)).fill(0).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'activePagButton' : 'paginationButton'}
            >
              {index + 1}
            </button>
          ))}
        </div>
    </div>
  );
};

export default TaskManager;