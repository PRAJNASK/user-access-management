// filepath: c:\\Users\\PRAJNA SHETTY\\user-access-management\\user-access-management\\frontend\\src\\App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Placeholder for HomePage
import LoginPage from './pages/LoginPage'; // Placeholder for LoginPage
import SignupPage from './pages/SignupPage'; // Placeholder for SignupPage
import SoftwarePage from './pages/SoftwarePage'; // Placeholder for SoftwarePage
import AdminPage from './pages/AdminPage'; // Placeholder for AdminPage
import ManagerDashboard from './pages/ManagerDashboard'; // Import ManagerDashboard
import ProtectedRoute from './components/ProtectedRoute'; // Corrected: Import ProtectedRoute.tsx (no .jsx)
import RequestAccess from './pages/RequestAccess'; // Import without .tsx extension
import MyRequestsPage from './pages/MyRequestsPage'; // Import MyRequestsPage

function App() {
  // Basic auth state simulation - replace with actual auth context
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token')); // Check token on load
  const [userRole, setUserRole] = React.useState<string | null>(localStorage.getItem('role')); // Check role on load

  // Simulate login
  const handleLogin = (role: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Simulate logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    // Clear token from localStorage or context
  };

  React.useEffect(() => {
    // Listen for storage changes to sync auth state across tabs (optional)
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'token' && !event.newValue) {
        handleLogout();
      }
      if (event.key === 'role' && !event.newValue) {
        setUserRole(null);
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, []);

  return (
  <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <nav style={{
          backgroundColor: '#333',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}>
            <li style={{ marginRight: '15px' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 12px' }} 
              >Home</Link>
            </li>
            {isAuthenticated ? (
              <>
                {userRole === 'Employee' && (
                  <>
                    <li style={{ marginRight: '15px' }}>
                      <Link to="/software" style={{ color: 'white', textDecoration: 'none', padding: '8px 0px' }} 
                      >Software</Link>
                    </li>
                    <li style={{ marginRight: '15px' }}>
                      <Link to="/request-access" style={{ color: 'white', textDecoration: 'none', padding: '8px 0px' }} 
                      >Request Access</Link>
                    </li>
                    <li style={{ marginRight: '15px' }}>
                      <Link to="/my-requests" style={{ color: 'white', textDecoration: 'none', padding: '8px 0px' }} 
                      >My Requests</Link>
                    </li>
                  </>
                )}
                {userRole === 'Admin' && (
                  <li style={{ marginRight: '15px' }}>
                    <Link to="/admin" style={{ color: 'white', textDecoration: 'none', padding: '8px 0px' }} 
                    >Admin Dashboard</Link>
                  </li>
                )}
                {userRole === 'Manager' && (
                  <li style={{ marginRight: '15px' }}>
                    <Link to="/manager-dashboard" style={{ color: 'white', textDecoration: 'none', padding: '8px 0px' }} 
                    >Manager Dashboard</Link>
                  </li>
                )}
              </>
            ) : (
              <>
                {/* Login and Signup links will be on the right side */}
              </>
            )}
          </ul>

          {/* Auth links / Logout Button on the right */}
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}>
            {isAuthenticated ? (
                <li style={{ marginLeft: '15px' }}>
                  <button onClick={handleLogout} style={{
                    color: 'white', 
                    backgroundColor: '#d9534f', // A shade of red for logout
                    border: 'none', 
                    padding: '8px 12px', 
                    borderRadius: '4px', 
                    cursor: 'pointer' // Removed transition for logout button hover
                  }}
                  // Removed onMouseOver and onMouseOut for logout button to remove hover effect
                  >Logout</button>
                </li>
            ) : (
              <>
                <li style={{ marginRight: '20px' }}>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '8px 12px' }} 
              >Login</Link>
            </li>
                <li style={{ marginRight: '15px' }}>
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none', padding: '8px 8px' }} 
              >SignUp</Link>
            </li>
              </>
            )}
          </ul>
        </nav>

        <hr style={{ display: 'none' }} /> {/* Hide the old hr */}

        <div style={{ padding: '20px' }}> {/* Added padding to content area */}
          <Routes>
            <Route path="/" element={<HomePage userRole={userRole} />} /> {/* Pass userRole to HomePage */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route 
              path="/software" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="Employee">
                  <SoftwarePage />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/request-access" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="Employee">
                  <RequestAccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-requests"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="Employee">
                  <MyRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="Admin">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager-dashboard" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="Manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Add other routes here - e.g., protected routes */}
          </Routes>
        </div> {/* This is the corrected closing div tag for the main content wrapper */}
      </div>
    </Router>
  );
}

export default App;
