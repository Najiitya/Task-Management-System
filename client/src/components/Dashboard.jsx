import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the VIP wristband from the browser's memory
    const token = localStorage.getItem('token');
    
    // 2. If there is no token, kick them back to the login page
    if (!token) {
      navigate('/'); 
      return;
    }

    // 3. If they have a token, fetch their specific tasks
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err.message);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Shred the VIP wristband
    navigate('/'); // Send back to login
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200">
            Logout
          </button>
        </div>
        
        {/* Task List Area */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center bg-white p-8 rounded-lg shadow-md text-lg">No tasks yet. You are all caught up! 🌴</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition duration-200 border-l-4 border-blue-500">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <p className="text-sm text-gray-400 mt-3 font-medium">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold uppercase tracking-wide">
                  {task.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;