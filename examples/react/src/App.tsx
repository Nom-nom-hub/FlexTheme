import { useState, useEffect } from 'react';
// In a real project, you would import from the npm package
// import { useFlexTheme } from 'flex-theme/react';

// For this example, we're simulating the import
// You would need to link the local package or use a relative import in a real setup
import { Theme } from './types';

// Simulate the useFlexTheme hook for the example
function useFlexTheme() {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const resolved = newTheme === 'auto' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : newTheme;
    setResolvedTheme(resolved);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', resolved);
    
    // Store in localStorage
    localStorage.setItem('flex-theme', newTheme);
  };
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Initialize on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('flex-theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Apply system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState('auto');
      setResolvedTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return { theme, resolvedTheme, setTheme, toggleTheme };
}

function App() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useFlexTheme();
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };
  
  useEffect(() => {
    addLog(`Theme changed to ${theme} (resolved as ${resolvedTheme})`);
  }, [theme, resolvedTheme]);
  
  useEffect(() => {
    addLog('App initialized');
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>flex-theme React Example</h1>
        <p>This example demonstrates how to use flex-theme in a React application.</p>
        
        <div className="theme-info">
          <div>
            <h3>Current Theme</h3>
            <span className="theme-badge">{theme}</span>
          </div>
          <div>
            <h3>Resolved Theme</h3>
            <span className="theme-badge">{resolvedTheme}</span>
          </div>
        </div>
        
        <div className="theme-controls">
          <button onClick={toggleTheme}>
            Toggle Theme
          </button>
          
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <h2>Theme Change Log</h2>
        <div className="log-container">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
