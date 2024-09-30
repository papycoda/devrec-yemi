import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, Bell, Clock, AlertCircle, User, X, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onClick }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MID': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div onClick={() => onClick(project)} className="bg-white rounded shadow p-3 mb-3 cursor-pointer hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold">{project.name}</div>
        <div className={`${getPriorityColor(project.priority)} text-white text-xs px-2 py-1 rounded`}>
          {project.priority}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
      <div className="flex items-center text-gray-500 text-xs space-x-2">
        <div className="flex items-center"><Clock className="w-3 h-3 mr-1" />{new Date(project.date_created).toLocaleDateString()}</div>
        <div className="flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{project.status}</div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center text-gray-500 text-xs group relative">
          <User className="w-3 h-3 mr-1" />
          {project.assigned_to ? project.assigned_to.username : 'Unassigned'}
          <span className="absolute bottom-full left-0 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Assigned to: {project.assigned_to ? project.assigned_to.username : 'Unassigned'}
          </span>
        </div>
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold group relative">
          {project.created_by.username[0].toUpperCase()}
          <span className="absolute bottom-full right-0 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Created by: {project.created_by.username}
          </span>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};


const ProjectDetailModal = ({ project, onClose, onUpdate, users }) => {
  const [editedProject, setEditedProject] = useState(project);
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: name === 'assigned_to_id' ? (value === '' ? null : parseInt(value, 10)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/projects/${project.id}/`, editedProject, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={editedProject.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={editedProject.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          value={editedProject.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="NOT_STARTED">To do</option>
          <option value="IN_PROGRESS">Doing</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          value={editedProject.priority}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="LOW">Low</option>
          <option value="MID">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="assigned_to_id" className="block text-sm font-medium text-gray-700">Assigned To</label>
        <select
          id="assigned_to_id"
          name="assigned_to_id"
          value={editedProject.assigned_to ? editedProject.assigned_to.id : ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Update Project
      </button>
    </form>
  );
};

const NewProjectModal = ({ onClose, onProjectCreated, users }) => {
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: '',
    status: 'NOT_STARTED',
    assigned_to_id: null
  });
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: name === 'assigned_to_id' ? (value === '' ? null : parseInt(value, 10)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/projects/', newProject, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      onProjectCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={newProject.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={newProject.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          value={newProject.priority}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select priority</option>
          <option value="LOW">Low</option>
          <option value="MID">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="assigned_to_id" className="block text-sm font-medium text-gray-700">Assigned To</label>
        <select
          id="assigned_to_id"
          name="assigned_to_id"
          value={newProject.assigned_to_id || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Project
      </button>
    </form>
  );
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/projects/', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          axios.get('http://localhost:8000/api/users/', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        setProjects(projectsResponse.data);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };


  const getStatusColumn = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Doing';
      case 'DONE':
        return 'Done';
      default:
        return 'To do';
    }
  };

  const columns = [
    { title: 'To do', status: 'To do' },
    { title: 'Doing', status: 'Doing' },
    { title: 'Done', status: 'Done' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gradient-to-r from-purple-400 to-pink-400 min-h-screen p-4">
      <header className="flex justify-between items-center mb-4">
        <div className="text-white font-bold text-xl">Project Board</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-white/20 p-2 rounded hover:bg-white/30 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
          <button className="bg-white/20 p-2 rounded hover:bg-white/30 transition-colors duration-200">
            <Bell className="h-5 w-5 text-white" />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/20 p-2 rounded hover:bg-white/30 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 text-white" />
        </button>
      </header>
      <div className="flex justify-center">
        <div className="flex space-x-4 overflow-x-auto pb-4 max-w-7xl">
          {columns.map(({ title, status }) => (
            <div key={title} className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
              <h2 className="font-bold mb-4">{title}</h2>
              {projects
                .filter(project => getStatusColumn(project.status) === status)
                .map(project => (
                  <ProjectCard key={project.id} project={project} onClick={handleProjectClick} />
                ))}
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)}>
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleProjectUpdated}
          users={users}
        />
      </Modal>
      <Modal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)}>
        <NewProjectModal
          onClose={() => setIsNewProjectModalOpen(false)}
          onProjectCreated={handleProjectCreated}
          users={users}
        />
      </Modal>
    </div>
  );
};

export default ProjectList;