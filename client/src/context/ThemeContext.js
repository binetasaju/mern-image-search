import React, { createContext, useState } from 'react';

// This is the new default theme (Neutral with a Blue accent)
const defaultTheme = {
  // Accent Color
  '--primary-color': '#007bff',
  '--primary-hover': '#0056b3',
  '--primary-text-color': '#ffffff',

  // Neutral Colors for other buttons
  '--secondary-color': '#6c757d',
  '--secondary-hover': '#5a6268',
  '--secondary-text-color': '#ffffff',
  '--info-color': '#6c757d',
  '--info-hover': '#5a6268',
  '--info-text-color': '#ffffff',
  '--danger-color': '#dc3545',
  '--danger-hover': '#c82333',
  '--danger-text-color': '#ffffff',

  // Neutral Backgrounds & Text
  '--background-color': '#f8f9fa',
  '--widget-background': '#ffffff',
  '--text-color': '#212529',
  '--text-color-light': '#6c757d',
  '--border-color': '#dee2e6',
};

// Create the context
export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
});

// Create the provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};