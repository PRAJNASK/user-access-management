// filepath: c:\\Users\\PRAJNA SHETTY\\user-access-management\\user-access-management\\frontend\\src\\pages\\SoftwarePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Software {
  id: number;
  name: string;
  description: string;
  accessLevels: string[];
}

interface ApiErrorResponse {
  message: string;
}

const SoftwarePage: React.FC = () => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoftware = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please login.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:5000/api/software', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSoftwareList(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const apiError = err.response.data as ApiErrorResponse;
          setError(apiError.message || 'Failed to fetch software list.');
        } else {
          setError('An unexpected error occurred.');
        }
        console.error('Fetch software error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSoftware();
  }, []);

  if (loading) {
    return <p>Loading software...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Available Software</h2>
      {softwareList.length === 0 ? (
        <p>No software available at the moment.</p>
      ) : (
        <ul>
          {softwareList.map((software) => (
            <li key={software.id}>
              <h3>{software.name}</h3>
              <p>{software.description}</p>
              <p>Access Levels: {software.accessLevels.join(', ')}</p>
              {/* Add request access button/logic here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SoftwarePage;
