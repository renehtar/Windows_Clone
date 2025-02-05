import './app.css';
import React, { useState } from 'react';
import AppShortcutTemplate from './components/appShortcutTemplate/AppShortcutTemplate';
import Window from './components/window/Window';
import Taskbar from './components/taskbar/Taskbar';
import ActivateWindows from './components/activateWindows/ActivateWindows';
import ModalStartWindows from './components/modalStartWindows/ModalStartWindows';
import { rootFolder, findObject } from './folderStructure';

const desktopApps = findObject(rootFolder, 'Área de trabalho', true).files;

export default function App() {
  const [apps, setApps] = useState(desktopApps);
  const [focusedApp, setFocusedApp] = useState(null);
  const [activeWindow, setActiveWindow] = useState(null);

  const openWindow = (app) => {
    const updatedApps = apps.map((item) =>
      item.name === app.name.replace(`.${app.extension}`, '')
        ? {
            ...item,
            windows: [
              ...item.windows,
              {
                id: Date.now(),
                title: app.name.replace(`.${app.extension}`, ''),
                contentComponent: app.content,
                isMinimized: false,
              },
            ],
          }
        : item
    );

    setApps(updatedApps);
  };

  const closeWindow = (windowId) => {
    const updatedApps = apps.map((app) => ({
      ...app,
      windows: app.windows.filter((window) => window.id !== windowId),
    }));

    setApps(
      updatedApps.map((app) => {
        if (app.windows.length > 0) {
          return {
            ...app,
            windows: app.windows.map((window) => ({
              ...window,
              title: window.title,
            })),
          };
        }
        return app;
      })
    );
  };

  const minimizeWindow = (windowId) => {
    const updatedApps = apps.map((app) => ({
      ...app,
      windows: app.windows.map((window) => {
        window.isMinimized =
          window.id === windowId ? !window.isMinimized : window.isMinimized;
        return window;
      }),
    }));

    setApps(
      updatedApps.map((app) => {
        if (app.windows.length > 0) {
          return {
            ...app,
            windows: app.windows.map((window) => ({
              ...window,
              title: window.title,
            })),
          };
        }
        return app;
      })
    );
  };

  const handleDesktopClick = () => setFocusedApp(null);

  const renderWindows = () =>
    apps.flatMap((app) =>
      app.windows.map((windowApp) => (
        <Window
          windowApp={windowApp}
          key={windowApp.id}
          img={app.icon}
          onClose={() => closeWindow(windowApp.id)}
          onMinimize={() => minimizeWindow(windowApp.id)}
          setActiveWindow={() => setActiveWindow(windowApp)}
          isActive={activeWindow?.id === windowApp.id}
        >
          {<windowApp.contentComponent openWindow={openWindow} />}
        </Window>
      ))
    );

  return (
    <>
      <div className="desktop" onClick={handleDesktopClick}>
        {apps.map((app, index) => (
          <AppShortcutTemplate
            key={app.icon}
            openWindow={openWindow}
            app={app}
            focusedApp={focusedApp}
            setFocusedApp={setFocusedApp}
            index={index}
          />
        ))}
        {renderWindows()}
        <ActivateWindows />
      </div>

      <Taskbar
        apps={apps}
        openWindow={openWindow}
        closeWindow={closeWindow}
        onMinimize={minimizeWindow}
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        focusedApp={focusedApp}
        setFocusedApp={setFocusedApp}
      />
      <ModalStartWindows />
    </>
  );
}
