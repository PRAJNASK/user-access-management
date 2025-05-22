// filepath: c:\\Users\\PRAJNA SHETTY\\user-access-management\\user-access-management\\frontend\\src\\pages\\AdminPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SoftwareInput {
  name: string;
  description: string;
  accessLevels: string; // Comma-separated string
}

interface ApiErrorResponse {
  message: string;
}

const AdminPage: React.FC = () => {
  const [softwareInput, setSoftwareInput] = useState<SoftwareInput>({
    name: '',
    description: '',
    accessLevels: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSoftwareInput({
      ...softwareInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required.');
        return;
      }
      const accessLevelsArray = softwareInput.accessLevels.split(',').map(s => s.trim()).filter(s => s);
      if (accessLevelsArray.length === 0) {
        setError('Please provide at least one access level.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/software/create', 
        { ...softwareInput, accessLevels: accessLevelsArray },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`Software "${response.data.name}" created successfully!`);
      setSoftwareInput({ name: '', description: '', accessLevels: '' }); // Reset form
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiErrorResponse;
        setError(apiError.message || 'Failed to create software.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Create software error:', err);
    }
  };

  // Add functionality to view/manage users and requests if needed

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <section>
        <h3>Create New Software</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Software Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={softwareInput.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={softwareInput.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="accessLevels">Access Levels (comma-separated):</label>
            <input
              type="text"
              id="accessLevels"
              name="accessLevels"
              value={softwareInput.accessLevels}
              onChange={handleChange}
              placeholder="e.g., Read, Write, Admin"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <button type="submit">Create Software</button>
        </form>
      </section>

      {/* Add sections for managing users and software requests here */}
    </div>
  );
};

export default AdminPage;
