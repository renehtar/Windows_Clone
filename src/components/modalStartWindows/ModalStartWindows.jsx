import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../icon/Icon';
import './modalStartWindows.scss';

export const startWindowsContext = createContext();

export const StartWindowsProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <startWindowsContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </startWindowsContext.Provider>
  );
};

export default function ModalStartWindows() {
  const { isActive, setIsActive } = useContext(startWindowsContext);

  useEffect(() => {
    setIsActive(true);
  }, []);

  return (
    <div className={`modalContainer ${isActive ? 'active' : ''}`}>
      <div className="modal" onClick={() => setIsActive(false)}>
        <Icon src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Windows_icon_logo.png" />
      </div>
    </div>
  );
}
