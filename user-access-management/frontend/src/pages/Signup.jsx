import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup handleSubmit called'); // New log
    try {
      console.log('Attempting signup with:', { username }); // New log
      const response = await axios.post('http://localhost:5000/api/auth/signup', { username, password });
      console.log('Signup API call successful, response:', response); // New log
      alert('Signup successfully! Please login.');
      console.log('Alert shown, navigating to /login'); // New log
      navigate('/login');
    } catch (err) {
      console.error('Signup error object in catch block:', err); // Changed log message for clarity
      console.error('Type of error object:', typeof err);
      try {
        console.error('Error object stringified:', JSON.stringify(err));
      } catch (stringifyError) {
        console.error('Could not stringify error object:', stringifyError);
      }

      let errorMessage = 'Signup failed. Please try again.';
      if (axios.isAxiosError(err) && err.response) {
        console.error('Axios error response data:', err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err instanceof Error) {
        console.error('Error instance message:', err.message);
        errorMessage = err.message || errorMessage;
      }
      alert(errorMessage);
      console.log('Error alert shown'); // New log
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
