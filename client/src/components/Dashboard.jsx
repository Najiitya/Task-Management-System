import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', due_date: '', status: 'todo' });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // FETCH ALL TASKS
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchTasks();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // CREATE (POST) or UPDATE (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTask ? `http://localhost:5000/tasks/${editingTask.id}` : "http://localhost:5000/tasks";
    const method = editingTask ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', due_date: '', status: 'todo' });
        fetchTasks(); // Refresh the list
      }
    } catch (err) {
      console.error("Error saving task:", err.message);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) fetchTasks(); // Refresh the list
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    // Format date to YYYY-MM-DD for the input field
    const formattedDate = task.due_date ? task.due_date.split('T')[0] : '';
    setFormData({ 
      title: task.title, 
      description: task.description, 
      due_date: formattedDate, 
      status: task.status 
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
          <div className="space-x-4">
            <button 
              onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', due_date: '', status: 'todo' }); setShowModal(true); }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition shadow-md"
            >
              + Add Task
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition shadow-md">
              Logout
            </button>
          </div>
        </div>

        {/* Task List Section */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-gray-500 text-center bg-white p-12 rounded-lg shadow-md">
              <p className="text-xl">No tasks found. Click "+ Add Task" to begin! 🌴</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start hover:shadow-lg transition border-l-4 border-blue-500">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      task.status === 'done' ? 'bg-green-100 text-green-700' : 
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                    <p className="text-xs text-gray-400 font-medium italic">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button onClick={() => openEditModal(task)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded border border-blue-200 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded border border-red-200 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Add/Edit Task */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {editingTask ? "📝 Update Task" : "➕ Add New Task"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.due_date} 
                    onChange={e => setFormData({...formData, due_date: e.target.value})} 
                    required 
                  />
                </div>
                {editingTask && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold shadow-md transition">
                    {editingTask ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;