// filepath: c:\\Users\\PRAJNA SHETTY\\user-access-management\\user-access-management\\frontend\\src\\pages\\LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios'; // You\'ll need to install axios: npm install axios or yarn add axios
import { useNavigate, Link } from 'react-router-dom'; // Import Link

interface LoginPageProps {
  onLogin: (role: string, token: string) => void; // Updated to accept token
}

interface ApiErrorResponse {
  message: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      // Assuming the backend returns a token and user role
      const { token, role } = response.data;
      localStorage.setItem('token', token); // Store the token
      localStorage.setItem('role', role); // Store the role
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set auth header for subsequent requests
      onLogin(role, token); // Update auth state in App.tsx, pass token
      // Navigate based on role
      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Manager') {
        navigate('/'); // Redirect Manager to HomePage
      } else if (role === 'Employee') {
        navigate('/'); // Redirect Employee to HomePage
      } else {
        navigate('/login'); // Fallback to login if role is unknown
      }
    } catch (err) {
      console.error('Login error object:', err); // Log the raw error
      if (axios.isAxiosError(err)) {
        console.error('Is Axios error: true');
        if (err.response) {
          console.error('Axios error has response object:', err.response);
          console.error('Axios error response data:', err.response.data);
          console.error('Axios error response status:', err.response.status);
          console.error('Axios error response headers:', err.response.headers);
          const apiError = err.response.data as ApiErrorResponse;
          // Check if apiError itself and apiError.message are defined
          if (apiError && typeof apiError.message === 'string') {
            setError(apiError.message);
          } else {
            setError('Login failed: Backend error response is not in the expected format.');
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('Axios error has request object (no response received):', err.request);
          setError('Login failed: No response from server. Please check network connection and if backend is running.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Axios error, but no response and no request (error in request setup):', err.message);
          setError('Login failed: Error setting up request. ' + err.message);
        }
      } else {
        // Not an Axios error
        console.error('Is Axios error: false');
        if (err instanceof Error) {
          console.error('Non-Axios error message:', err.message);
          setError('An unexpected error occurred: ' + err.message);
        } else {
          console.error('Non-Axios, non-Error object caught:', err);
          setError('An unexpected and unknown error occurred.');
        }
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
