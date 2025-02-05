import React, { useState } from 'react';
import './fileManager.scss';
import {
  RightOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import FolderView from '../folderView/FolderView';
import { defaultUser } from '../../folderStructure';
import Icon from '../icon/Icon';

export default function FileManager({ openWindow }) {
  const user = defaultUser;
  const [indexCurrentFolder, setIndexCurrentFolder] = useState(0);
  const [currentFolder, setCurrentFolder] = useState(
    user.subfolders[0] ? user.subfolders[0] : user
  );
  const [width, setWidth] = useState(160);
  const [folderHistory, setFolderHistory] = useState([currentFolder]);

  const handleOpeningFolders = (folder) => {
    if (folder.name !== folderHistory[indexCurrentFolder].name) {
      const updatedHistory =
        indexCurrentFolder + 1 < folderHistory.length
          ? [...folderHistory.slice(0, indexCurrentFolder + 1), folder]
          : [...folderHistory, folder];
      setIndexCurrentFolder((prev) => prev + 1);
      setCurrentFolder(folder);
      setFolderHistory([...updatedHistory]);
    }
  };

  const incrementCurrentFolder = () => {
    if (indexCurrentFolder + 1 < folderHistory.length) {
      setIndexCurrentFolder((prev) => prev + 1);
      setCurrentFolder(folderHistory[indexCurrentFolder + 1]);
    }
  };

  const decrementCurrentFolder = () => {
    if (indexCurrentFolder > 0) {
      setIndexCurrentFolder((prev) => prev - 1);
      setCurrentFolder(folderHistory[indexCurrentFolder - 1]);
    }
  };

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const initialWidth = width;

    const handleMouseMove = (e) => {
      const newWidth = initialWidth + (e.clientX - startX);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const getShortPath = (path) => {
    const prefix = `${user.path}\\`;
    return path.substring(prefix.length);
  };

  return (
    <>
      <div className="header">
        <div className="arrows">
          <ArrowLeftOutlined
            className={`arrow returnArrow ${
              indexCurrentFolder > 0 && 'active'
            }`}
            onClick={decrementCurrentFolder}
          />
          <ArrowRightOutlined
            className={`arrow advanceArrow ${
              indexCurrentFolder !== folderHistory.length - 1 && 'active'
            }`}
            onClick={incrementCurrentFolder}
          />
        </div>
        <div className="foldersPath">
          {currentFolder.name !== 'Acesso rápido' && (
            <div className="pathDefault">
              <Icon className="iconPath" src={currentFolder.icon} />
              <RightOutlined />
              <span>este computador</span>
            </div>
          )}

          {currentFolder.path && (
            <>
              {currentFolder.name === 'Acesso rápido' && (
                <Icon className="iconPath" src={currentFolder.icon} />
              )}
              <RightOutlined />
              <span>{getShortPath(currentFolder.path)}</span>
            </>
          )}
        </div>
        <label className="searchBar">
          <input
            className="search"
            type="text"
            placeholder={`pesquisar em ${currentFolder.name}`}
          />
          <SearchOutlined className="searchIcon" />
        </label>
      </div>
      <div className="fileManager">
        <ul className="folders" style={{ width: `${width}px` }}>
          {user.subfolders?.map((folder) => (
            <li
              key={folder.path}
              className={`folder ${
                currentFolder.path.includes(folder.path) && 'active'
              }`}
              onClick={() => handleOpeningFolders(folder)}
            >
              <Icon className="iconFolder" src={folder.icon} />
              <span>{folder.name}</span>
            </li>
          ))}
        </ul>
        <div className="resizeBar" onMouseDown={handleMouseDown}></div>
        <FolderView
          folder={currentFolder}
          handleOpeningFolders={handleOpeningFolders}
          openWindow={openWindow}
          setFolderHistory={setFolderHistory}
        />
      </div>
    </>
  );
}
