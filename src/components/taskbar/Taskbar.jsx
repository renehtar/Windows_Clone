import React, { useState, useEffect } from 'react';
import './taskbar.scss';
import {
  WindowsFilled,
  SearchOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import WindowsHomeContent from '../windowsHomeContent/WindowsHomeContent';

export default function Taskbar({
  apps,
  openWindow,
  closeWindow,
  onMinimize,
  activeWindow,
  setActiveWindow,
  focusedApp,
  setFocusedApp,
}) {
  const [windowsHomeActive, setWindowsHomeActive] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  const ABNTText = `Português (Brasil)
Teclado Português (Brasil ABNT2)

Para alternar os métodos de entrada, pressione
a tecla Windows+Espaço.`;

  const handleOpenOrFocusApp = (e, app, windowId) => {
    e.stopPropagation();

    if (app.windows.length > 1 && !windowId) return;
    if (app.windows.length > 1) {
      setActiveWindow(app.windows.find((window) => window.id === windowId));
      setFocusedApp(app.windows.find((window) => window.id === windowId));
      app.windows.find((window) => window.id === windowId).isMinimized
        ? onMinimize(app.windows.find((window) => window.id === windowId).id)
        : '';
      return;
    }

    if (!app.windows.length) return openWindow(app);

    app.windows[0].id === activeWindow?.id
      ? onMinimize(app.windows[0].id)
      : setActiveWindow(app.windows[0]);
  };

  const handleCloseWindow = (e, windowId) => {
    e.stopPropagation();

    closeWindow(windowId);
  };

  const handleClickWindowsStart = () => {
    setFocusedApp('init');
    setWindowsHomeActive((prev) => !prev);
  };

  useEffect(() => {
    if (focusedApp !== 'init') {
      setWindowsHomeActive(false);
    }
  }, [focusedApp]);

  useEffect(() => {
    const formatDate = (date) => {
      return {
        hours: date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: date.toLocaleDateString('pt-BR'),
        long: date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    };

    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentDate(formatDate(now));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="taskbar">
      <ul className="left">
        <li className="taskbarApp">
          <WindowsHomeContent
            active={windowsHomeActive}
            focusedApp={focusedApp}
            setWindowsHomeActive={setWindowsHomeActive}
          />
          <div className="windowsStart" onClick={handleClickWindowsStart}>
            <WindowsFilled className="windowsStartIcon" />
          </div>
          <label className="windowsSearch">
            <input type="text" className="search" placeholder="Pesquisar" />
            <SearchOutlined className="searchIcon" />
          </label>
        </li>

        {apps.map((app, index) => (
          <li
            key={index}
            className={`app taskbarApp ${
              app.windows.length > 0 ? 'hasWindow' : ''
            } ${
              app.windows.some((window) => window.id === activeWindow?.id)
                ? 'active'
                : ''
            }`}
            onClick={(e) => handleOpenOrFocusApp(e, app)}
          >
            <img className="appIcon" src={app.icon} alt="" />
            <div className="suspendedWindowContainer">
              {app.windows.map((currentWindow) => (
                <div
                  key={currentWindow.id}
                  className="windowPreview"
                  onClick={(e) =>
                    handleOpenOrFocusApp(e, app, currentWindow.id)
                  }
                >
                  <div className="headerPreview">
                    <h2>{currentWindow.title}</h2>
                    <span
                      className="closeWindow"
                      onClick={(e) => handleCloseWindow(e, currentWindow.id)}
                    >
                      X
                    </span>
                  </div>
                  <div
                    className="container"
                    style={{
                      margin: `${
                        currentWindow.title === 'Prompt' ? '-2.5rem' : '-5.5rem'
                      } -7rem`,
                    }}
                  >
                    {<currentWindow.contentComponent />}
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <ul className="right">
        <li className="app taskbarApp smallPadding" title="Sem Som">
          <SoundOutlined className="appIcon soundIcon" />
        </li>
        <li className="app taskbarApp toColumn smallPadding" title={ABNTText}>
          <span>POR</span>
          <span>PTB2</span>
        </li>
        <li className="app taskbarApp toColumn" title={currentDate.long}>
          <span>{currentDate.hours}</span>
          <span>{currentDate.date}</span>
        </li>
        <li className="app taskbarApp" title="Não há notificações novas">
          <img
            className="appIcon"
            src="https://www.wambooli.com/blog/wp-content/uploads/2015/08/ma17-Notifications.png"
            alt=""
          />
        </li>
        <div className="desktopShortcut"></div>
      </ul>
    </div>
  );
}
