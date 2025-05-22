// filepath: c:\Users\PRAJNA SHETTY\user-access-management\user-access-management\frontend\src\pages\RequestAccess.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface Software {
  id: number;
  name: string;
  // Add other properties if any, e.g., description
}

interface RequestData {
  softwareId: number;
  accessType: string;
  reason: string;
}

const RequestAccess: React.FC = () => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string>('');
  const [accessType, setAccessType] = useState<string>('Read'); // Default to 'Read'
  const [reason, setReason] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSoftware = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Authentication token not found. Please login.');
          navigate('/login');
          return;
        }
        const response = await axios.get<Software[]>('http://localhost:5000/api/software', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSoftwareList(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedSoftware(String(response.data[0].id)); // Default to first software, ensure string
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching software:', error);
        const axiosError = error as AxiosError<{ message?: string }>;
        setMessage('Failed to fetch software list. ' + (axiosError.response?.data?.message || axiosError.message));
        setLoading(false);
      }
    };

    fetchSoftware();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!selectedSoftware || !accessType || !reason) {
      setMessage('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please login.');
        navigate('/login');
        return;
      }

      const requestData: RequestData = {
        softwareId: parseInt(selectedSoftware, 10),
        accessType,
        reason,
      };

      await axios.post('http://localhost:5000/api/requests', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Access request submitted successfully!');
      // Optionally, clear form or navigate away
      // setSelectedSoftware(softwareList.length > 0 ? String(softwareList[0].id) : '');
      // setAccessType('Read');
      // setReason('');
      // setTimeout(() => navigate('/home'), 2000); // Example navigation
      setLoading(false);
    } catch (error) {
      console.error('Error submitting access request:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      setMessage('Failed to submit access request. ' + (axiosError.response?.data?.message || axiosError.message));
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Request Software Access</h2>
      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="software">Software:</label>
          <select 
            id="software" 
            value={selectedSoftware} 
            onChange={(e) => setSelectedSoftware(e.target.value)} 
            required
            disabled={loading || softwareList.length === 0}
          >
            {softwareList.length === 0 && <option value="">No software available</option>}
            {softwareList.map((software) => (
              <option key={software.id} value={String(software.id)}>
                {software.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="accessType">Access Type:</label>
          <select 
            id="accessType" 
            value={accessType} 
            onChange={(e) => setAccessType(e.target.value)} 
            required
            disabled={loading}
          >
            <option value="Read">Read</option>
            <option value="Write">Write</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="reason">Reason:</label>
          <textarea 
            id="reason" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || softwareList.length === 0}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestAccess;
