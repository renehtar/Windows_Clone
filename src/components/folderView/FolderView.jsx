import React, { useState } from 'react';
import './folderView.scss';

export default function FolderView({
  folder,
  handleOpeningFolders,
  openWindow,
  setFolderHistory,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleFoldersAndFiles = (item) => {
    if (item.type === 'folder') {
      setFolderHistory((prev) => [...prev, item]);
      handleOpeningFolders(item);
    } else {
      openWindow(item);
    }
  };

  const truncateString = (str, maxLen) => {
    return str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;
  };

  return (
    <div className="folderView">
      <ul>
        {[...folder.subfolders, ...folder.files].map((item) => (
          <li
            tabIndex="0"
            key={item.name}
            className={selectedItem?.name.includes(item.name) ? 'active' : ''}
            onClick={() => setSelectedItem(item)}
            onDoubleClick={() => handleFoldersAndFiles(item)}
            onKeyUp={({ key }) =>
              key === 'Enter' && handleFoldersAndFiles(item)
            }
          >
            <div className="icons">
              {item.type === 'folder' && (
                <img
                  src="https://winaero.com/blog/wp-content/uploads/2018/11/folder-icon-big-256.png"
                  alt="folder icon"
                />
              )}
              <img src={item.icon} alt="item icon" />
            </div>
            <div className="infos">
              <p title={item.name}>{truncateString(item.name, 28)}</p>
              {folder.name === 'Acesso rápido' && <p>Este Computador</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
