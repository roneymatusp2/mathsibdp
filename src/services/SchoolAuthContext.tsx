import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, SchoolUser, getCurrentSchool, getCurrentUser, logoutSchool, logoutUser } from './schoolAuth';

interface SchoolAuthContextType {
  currentSchool: School | null;
  currentUser: SchoolUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCurrentSchool: (school: School | null) => void;
  setCurrentUser: (user: SchoolUser | null) => void;
  logout: () => void;
}

const SchoolAuthContext = createContext<SchoolAuthContextType>({
  currentSchool: null,
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  setCurrentSchool: () => {},
  setCurrentUser: () => {},
  logout: () => {},
});

export const useSchoolAuth = () => useContext(SchoolAuthContext);

interface SchoolAuthProviderProps {
  children: ReactNode;
}

export const SchoolAuthProvider: React.FC<SchoolAuthProviderProps> = ({ children }) => {
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [currentUser, setCurrentUser] = useState<SchoolUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored school and user on component mount
    const storedSchool = getCurrentSchool();
    const storedUser = getCurrentUser();
    
    setCurrentSchool(storedSchool);
    setCurrentUser(storedUser);
    setIsLoading(false);
  }, []);
  
  const logout = () => {
    setCurrentUser(null);
    
    if (currentUser) {
      logoutUser();
    }
    
    if (currentSchool) {
      setCurrentSchool(null);
      logoutSchool();
    }
  };
  
  // Determine authentication state based on presence of user and school
  const isAuthenticated = !!currentSchool && !!currentUser;
  
  const value = {
    currentSchool,
    currentUser,
    isAuthenticated,
    isLoading,
    setCurrentSchool,
    setCurrentUser,
    logout,
  };
  
  return (
    <SchoolAuthContext.Provider value={value}>
      {children}
    </SchoolAuthContext.Provider>
  );
};

export default SchoolAuthContext;
