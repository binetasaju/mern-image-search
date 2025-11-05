import React, { createContext, useState } from 'react';

// This is the default theme (our old blue)
const defaultTheme = {
  '--primary-color': '#007bff',
  '--primary-hover': '#0056b3',
  '--secondary-color': '#28a745',
  '--secondary-hover': '#218838',
  '--info-color': '#17a2b8',
  '--info-hover': '#138496',
  '--danger-color': '#dc3545',
  '--danger-hover': '#c82333',
  '--background-color': '#f4f7f6',
  '--widget-background': '#ffffff',
  '--text-color': '#333',
  '--text-color-light': '#777',
  '--border-color': '#eee',
  '--primary-text-color': '#ffffff',
  '--secondary-text-color': '#ffffff',
  '--info-text-color': '#ffffff',
  '--danger-text-color': '#ffffff',
};

export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};