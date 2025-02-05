import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StartWindowsProvider } from './components/modalStartWindows/ModalStartWindows';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <StartWindowsProvider>
      <App />
    </StartWindowsProvider>
  </StrictMode>
);
