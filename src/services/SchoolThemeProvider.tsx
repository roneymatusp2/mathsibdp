import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSchoolAuth } from './SchoolAuthContext';

interface SchoolThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  schoolName: string;
}

const defaultTheme: SchoolThemeContextType = {
  primaryColor: '#4f46e5', // Default Indigo
  secondaryColor: '#3b82f6', // Default Blue
  schoolName: 'IBMaths Choice'
};

const SchoolThemeContext = createContext<SchoolThemeContextType>(defaultTheme);

export const useSchoolTheme = () => useContext(SchoolThemeContext);

interface SchoolThemeProviderProps {
  children: ReactNode;
}

export const SchoolThemeProvider: React.FC<SchoolThemeProviderProps> = ({ children }) => {
  const { currentSchool } = useSchoolAuth();
  
  // Apply CSS variables for theme colors
  useEffect(() => {
    if (currentSchool) {
      document.documentElement.style.setProperty(
        '--primary-color', 
        currentSchool.primary_color || defaultTheme.primaryColor
      );
      document.documentElement.style.setProperty(
        '--secondary-color', 
        currentSchool.secondary_color || defaultTheme.secondaryColor
      );
    } else {
      // Reset to default colors if no school is selected
      document.documentElement.style.setProperty('--primary-color', defaultTheme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', defaultTheme.secondaryColor);
    }
  }, [currentSchool]);
  
  const themeValue: SchoolThemeContextType = {
    primaryColor: currentSchool?.primary_color || defaultTheme.primaryColor,
    secondaryColor: currentSchool?.secondary_color || defaultTheme.secondaryColor,
    logoUrl: currentSchool?.logo_url,
    schoolName: currentSchool?.name || defaultTheme.schoolName
  };
  
  return (
    <SchoolThemeContext.Provider value={themeValue}>
      {children}
    </SchoolThemeContext.Provider>
  );
};

export default SchoolThemeContext;
