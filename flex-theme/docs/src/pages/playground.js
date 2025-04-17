import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useFlexTheme } from 'flex-theme/react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function PlaygroundContent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useFlexTheme();
  const [cssVariables, setCssVariables] = useState('');
  const [customCSS, setCustomCSS] = useState(`
body {
  background-color: var(--color-background);
  color: var(--color-textPrimary);
}

.box {
  padding: 20px;
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.button {
  background-color: var(--color-primary);
  color: var(--color-textOnPrimary);
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.button:hover {
  background-color: var(--color-primaryDark);
}
  `.trim());

  // Get CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const styles = window.getComputedStyle(document.documentElement);
      let variables = '';
      
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--color-') || prop.startsWith('--spacing-') || prop.startsWith('--radius-')) {
          variables += `${prop}: ${styles.getPropertyValue(prop)};\n`;
        }
      }
      
      setCssVariables(variables);
    }
  }, [resolvedTheme]);

  return (
    <div className="container margin-top--lg margin-bottom--lg">
      <h1>Theme Playground</h1>
      <p>
        Experiment with flex-theme's CSS variables and see how they affect your UI.
      </p>
      
      <div className="playground">
        <div className="playground-controls">
          <div>
            <label htmlFor="theme-select">Theme:</label>
            <select 
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ marginLeft: '8px' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          
          <button onClick={toggleTheme} className="button button--primary">
            Toggle Theme
          </button>
        </div>
        
        <div className="row">
          <div className="col col--6">
            <h3>CSS Variables</h3>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <pre>
                <code>{cssVariables}</code>
              </pre>
            </div>
          </div>
          
          <div className="col col--6">
            <h3>Custom CSS</h3>
            <textarea
              value={customCSS}
              onChange={(e) => setCustomCSS(e.target.value)}
              style={{ width: '100%', height: '200px', fontFamily: 'monospace' }}
            />
          </div>
        </div>
        
        <h3>Preview</h3>
        <div className="playground-preview">
          <style>{customCSS}</style>
          <div className="box">
            <h2>Hello, {resolvedTheme} theme!</h2>
            <p>This is a preview of your custom CSS with the current theme.</p>
            <button className="button">Click me</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <Layout
      title="Theme Playground"
      description="Experiment with flex-theme's CSS variables"
    >
      <BrowserOnly>
        {() => <PlaygroundContent />}
      </BrowserOnly>
    </Layout>
  );
}
