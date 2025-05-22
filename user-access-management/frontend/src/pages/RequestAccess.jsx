import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is installed
import { useNavigate } from 'react-router-dom';

function RequestAccess() {
  const [softwareList, setSoftwareList] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [accessType, setAccessType] = useState('Read'); // Default to 'Read'
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
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
        const response = await axios.get('http://localhost:5000/api/software', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSoftwareList(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedSoftware(response.data[0].id); // Default to first software
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching software:', error);
        setMessage('Failed to fetch software list. ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchSoftware();
  }, [navigate]);

  const handleSubmit = async (e) => {
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

      const requestData = {
        softwareId: parseInt(selectedSoftware, 10),
        accessType,
        reason,
      };

      await axios.post('http://localhost:5000/api/requests', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Access request submitted successfully!');
      // Optionally, clear form or navigate away
      // setSelectedSoftware(softwareList.length > 0 ? softwareList[0].id : '');
      // setAccessType('Read');
      // setReason('');
      // setTimeout(() => navigate('/home'), 2000); // Example navigation
      setLoading(false);
    } catch (error) {
      console.error('Error submitting access request:', error);
      setMessage('Failed to submit access request. ' + (error.response?.data?.message || error.message));
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
              <option key={software.id} value={software.id}>
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
}

export default RequestAccess;
