import { createContext, useContext, useState, useEffect } from 'react';
import { users, joinRequests as initialRequests } from './../mockData/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(users);
  const [joinRequests, setJoinRequests] = useState(initialRequests);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const savedUser = localStorage.getItem('campusUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    const user = allUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('campusUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campusUser');
  };

  const approveRequest = (requestId) => {
    const request = joinRequests.find(r => r._id === requestId);
    if (!request) return false;

    const newUser = {
      ...request,
      _id: `user_${Date.now()}`,
      status: 'active',
      joinedAt: new Date(),
    };

    setAllUsers(prev => [...prev, newUser]);
    setJoinRequests(prev => prev.filter(r => r._id !== requestId));
    return true;
  };

  const rejectRequest = (requestId) => {
    setJoinRequests(prev => 
      prev.map(r => r._id === requestId ? { ...r, status: 'rejected' } : r)
    );
  };

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      _id: `user_${Date.now()}`,
      status: 'active',
      joinedAt: new Date(),
    };
    setAllUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (userId, updates) => {
    setAllUsers(prev =>
      prev.map(u => u._id === userId ? { ...u, ...updates } : u)
    );
    if (currentUser?._id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const value = {
    currentUser,
    allUsers,
    joinRequests,
    isLoading,
    login,
    logout,
    approveRequest,
    rejectRequest,
    addUser,
    updateUser,
    setJoinRequests,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


