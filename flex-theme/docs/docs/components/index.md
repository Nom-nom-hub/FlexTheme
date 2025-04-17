---
sidebar_position: 1
---

# Components Overview

flex-theme provides a set of React components that are built with the theme system. These components automatically adapt to the current theme and provide a consistent user experience.

## Installation

```bash
npm install @flex-theme/react-components
```

## Usage

```jsx
import { Button, Card, ThemeToggle } from '@flex-theme/react-components';
import '@flex-theme/react-components/styles.css';

function App() {
  return (
    <div>
      <ThemeToggle />
      
      <Card title="Hello, world!">
        <p>This is a card component that adapts to the current theme.</p>
        <Button>Click me</Button>
      </Card>
    </div>
  );
}
```

## Available Components

- [Button](./button.md): A button component with various styles and states
- [Card](./card.md): A card component with header, content, and footer sections
- [Input](./input.md): An input component with various styles and states
- [Checkbox](./checkbox.md): A checkbox component with various styles and states
- [Switch](./switch.md): A switch component for toggling between two states
- [Modal](./modal.md): A modal component for displaying content in a dialog

## Theming

All components automatically adapt to the current theme. They use CSS variables from flex-theme to ensure consistent styling across your application.

```jsx
import { useFlexTheme } from 'flex-theme/react';
import { Button } from '@flex-theme/react-components';

function ThemedButton() {
  const { resolvedTheme } = useFlexTheme();
  
  return (
    <Button variant="primary">
      This button is {resolvedTheme === 'light' ? 'light' : 'dark'} themed
    </Button>
  );
}
```

## Accessibility

All components are built with accessibility in mind. They include proper ARIA attributes, keyboard navigation, and focus management.

## Customization

You can customize the components by passing props or by using CSS variables. See the individual component documentation for more details.
