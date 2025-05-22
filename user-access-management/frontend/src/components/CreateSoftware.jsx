// CreateSoftware.js
import React, { useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';

function CreateSoftware() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevels, setAccessLevels] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login.');
      // Potentially navigate to login here
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/software', { // Use absolute URL
        name,
        description,
        accessLevels: accessLevels.split(',').map(a => a.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Software created successfully!');
      // Clear form fields
      setName('');
      setDescription('');
      setAccessLevels('');
    } catch (err) {
      console.error(err);
      setMessage('Error creating software: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <LogoutButton />
      <h2>Create Software</h2>
      {message && <p>{message}</p>} {/* Display messages */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" placeholder="Software Name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" placeholder="Software Description" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="accessLevels">Access Levels (comma-separated):</label>
          <input id="accessLevels" type="text" placeholder="e.g., Read, Write, Admin" value={accessLevels} onChange={e => setAccessLevels(e.target.value)} required />
        </div>
        <button type="submit">Create Software</button>
      </form>
    </div>
  );
}

export default CreateSoftware;
