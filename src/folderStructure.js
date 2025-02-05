import Icon from './components/icon/Icon';
import Prompt from './components/prompt/Prompt';
import FileManager from './components/fileManager/FileManager';

const defaultFileIcon =
  'https://cdn1.iconfinder.com/data/icons/modifiers-add-on-1-1/48/Sed-24-512.png';
const defaultFolderIcon = 'https://cdn-icons-png.flaticon.com/512/62/62312.png';

class Folder {
  constructor(name, icon) {
    this.name = name;
    this.icon = icon ? icon : defaultFolderIcon;
    this.type = 'folder';
    this.subfolders = [];
    this.files = [];
    this.path = '';
    this.parent = null;
    this.id = generateRandomId();
  }

  addSubfolder(subfolders) {
    if (!subfolders)
      throw new Error('função addSubFolder sem dados para acessar.');
    if (Array.isArray(subfolders)) {
      const thisContext = this;
      subfolders.forEach((subfolderItem) => {
        subfolderItem.parent = thisContext;
        thisContext.subfolders.push(subfolderItem);
      });
    } else {
      subfolders.parent = this;
      this.subfolders.push(subfolders);
    }
  }

  removeSubfolder(subfolderName) {
    const index = this.subfolders.findIndex(
      (subfolder) =>
        subfolder.name.toLowerCase() === subfolderName.toLowerCase()
    );
    if (index !== -1) {
      this.subfolders.splice(index, 1);
    }
  }

  addFile(file) {
    if (Array.isArray(file)) {
      this.files.push(...file);
    } else {
      this.files.push(file);
    }
  }

  setPath(parentPath) {
    if (parentPath === '') {
      this.path = this.name;
    } else {
      this.path = parentPath + '\\' + this.name;
    }

    for (const subfolder of this.subfolders) {
      subfolder.setPath(this.path);
    }
  }
}

class File {
  constructor(name, extension, content, icon, size, isShortcut = false) {
    this.name = isShortcut ? name : `${name}.${extension}`;
    this.extension = extension;
    this.content = content;
    this.icon = icon ? icon : defaultFileIcon;
    this.size = size;
    this.type = 'file';
    this.windows = [];
    this.isShortcut = isShortcut;
    this.id = generateRandomId();
  }

  createShortcut() {
    const nameWithoutExtension = this.name.replace(`.${this.extension}`, '');
    const shortcut = new File(
      nameWithoutExtension,
      this.extension,
      this.content,
      this.icon,
      this.size,
      true
    );

    return shortcut;
  }
}

function generateRandomId() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }

  return randomId;
}

function findPath(folder, targetName, isFolder = false) {
  targetName = targetName.toLowerCase();

  if (
    (isFolder && folder.name.toLowerCase() === targetName) ||
    (!isFolder &&
      folder.files.find((file) => file.name.toLowerCase() === targetName))
  ) {
    return folder.name;
  }

  for (const subfolder of folder.subfolders) {
    const path = findPath(subfolder, targetName, isFolder);
    if (path) {
      return folder.name + '\\' + path;
    }
  }

  return null;
}

function findChildrenFolder(currentFolder, targetName) {
  if (!currentFolder || !targetName) return;

  targetName = targetName.toLowerCase();

  const childrenFolder = currentFolder.subfolders.find(
    (subfolder) => subfolder.name.toLowerCase() === targetName
  );

  return childrenFolder;
}

function findObject(folder, targetName, isFolder = false) {
  targetName = targetName.toLowerCase();

  if (isFolder && folder.name.toLowerCase() === targetName) {
    return folder;
  }

  const foundFile = folder.files.find(
    (file) => file.name.toLowerCase() === targetName
  );
  if (foundFile) {
    return foundFile;
  }

  for (const subfolder of folder.subfolders) {
    const foundObject = findObject(subfolder, targetName, isFolder);
    if (foundObject) {
      return foundObject;
    }
  }

  return null;
}

function createFolder(folderName, currentFolder) {
  const newFolder = new Folder(folderName);
  currentFolder.addSubfolder(newFolder);
  newFolder.setPath(currentFolder.path);
}

function deleteFolder(folderName, currentFolder) {
  currentFolder.removeSubfolder(folderName);
}

const rootFolder = new Folder('C:');
const usersFolder = new Folder('Users');
const renehtarFolder = new Folder('renehtar');
const quickAccessFolder = new Folder(
  'Acesso rápido',
  'https://pngfre.com/wp-content/uploads/star-png-image-pngfre-11-300x285.png'
);
const desktopFolder = new Folder(
  'Área de trabalho',
  'https://winaero.com/blog/wp-content/uploads/2018/06/Desktop-icon-big-256.png'
);
const downloadsFolder = new Folder(
  'Downloads',
  'https://www.freeiconspng.com/uploads/downloads-icon-15.png'
);
const documentsFolder = new Folder(
  'Documentos',
  'https://w7.pngwing.com/pngs/521/255/png-transparent-computer-icons-data-file-document-file-format-others-thumbnail.png'
);
const imagensFolder = new Folder(
  'Imagens',
  'https://winaero.com/blog/wp-content/uploads/2019/09/Photos-app-icon-256-colorful.png'
);

const promptFile = new File(
  'Prompt',
  'exe',
  Prompt,
  'https://images.freeimages.com/fic/images/icons/127/sleek_xp_software/300/command_prompt.png',
  1024
);
const explorerFile = new File(
  'Explorador de Arquivos',
  'exe',
  FileManager,
  'https://upload.wikimedia.org/wikipedia/commons/9/9d/Windows_10_File_Explorer_icon.png',
  2048
);
const backgroundImages = [
  new File(
    'background Windows 11',
    'png',
    Icon,
    'https://c4.wallpaperflare.com/wallpaper/974/565/254/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg',
    2048
  ),
  new File(
    'background rio em meio a floresta',
    'png',
    Icon,
    'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg',
    2048
  ),
];

rootFolder.addSubfolder(usersFolder);
usersFolder.addSubfolder(renehtarFolder);
renehtarFolder.addSubfolder(quickAccessFolder);

quickAccessFolder.addSubfolder([
  desktopFolder,
  downloadsFolder,
  documentsFolder,
  imagensFolder,
]);

renehtarFolder.addSubfolder([
  desktopFolder,
  downloadsFolder,
  documentsFolder,
  imagensFolder,
]);

downloadsFolder.addSubfolder([
  new Folder('pasta CMD teste 1'),
  new Folder('pasta-CMD-teste-2'),
  new Folder('pasta_CMD_teste_3'),
]);

downloadsFolder.addFile(
  new File('arquivo teste', 'exe', FileManager, '', 2048)
);

documentsFolder.addFile([promptFile, explorerFile]);
imagensFolder.addFile(backgroundImages);

desktopFolder.addFile([
  promptFile.createShortcut(),
  explorerFile.createShortcut(),
]);

rootFolder.setPath('');

const defaultUser = findObject(
  rootFolder,
  rootFolder.subfolders[0].subfolders[0].name,
  true
);

export {
  rootFolder,
  defaultUser,
  findPath,
  findChildrenFolder,
  findObject,
  createFolder,
  deleteFolder,
};
