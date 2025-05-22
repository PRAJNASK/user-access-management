// filepath: c:\\Users\\PRAJNA SHETTY\\user-access-management\\user-access-management\\frontend\\src\\pages\\HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link

interface Software {
  id: number;
  name: string;
  description: string;
}

interface HomePageProps {
  userRole: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ userRole }) => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole === 'Employee') {
      const fetchSoftware = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError("Authentication token not found. Please log in again.");
            setLoading(false);
            return;
          }
          const response = await fetch('http://localhost:5000/api/software', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          const data: Software[] = await response.json();
          setSoftwareList(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
          console.error("Failed to fetch software:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSoftware();
    }
  }, [userRole]);

  if (userRole === 'Employee') {
    return (
      <div>
        <h1>Available Software</h1>
        {loading && <p>Loading software...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {softwareList.length > 0 ? (
          <ul>
            {softwareList.map((software) => (
              <li key={software.id}>
                <h2>{software.name}</h2>
                <p>{software.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No software available at the moment.</p>
        )}
        <Link to="/request-access">
          <button>Request Software Access</button>
        </Link>
      </div>
    );
  }

  // Default content for other roles or if role is not yet determined
  return (
    <div>
      <h1>Welcome to the User Access Management System</h1>
      {userRole ? <p>Your role is: {userRole}</p> : <p>Please log in or sign up to continue.</p>}
      {/* You can add role-specific content for Manager/Admin here if needed */}
    </div>
  );
};

export default HomePage;
