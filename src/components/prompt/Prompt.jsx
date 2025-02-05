import React, { useState, useEffect, useRef } from 'react';
import {
  rootFolder,
  findChildrenFolder,
  findObject,
  createFolder,
  deleteFolder,
  defaultUser,
} from '../../folderStructure';
import './prompt.scss';

const themes = {
  1: { color: 'red', background: '#fff' },
  2: { color: '#297dff', background: '#222' },
  0: { color: 'whitesmoke', background: '#222' },
};

export default function Prompt({ openWindow }) {
  const [currentFolder, setCurrentFolder] = useState(defaultUser);
  const [currentPath, setCurrentPath] = useState(`${currentFolder.path}>`);
  const [promptValue, setPromptValue] = useState(currentPath);
  const [textareaStyle, setTextareaStyle] = useState(themes[0]);
  const [generalHistory, setGeneralHistory] = useState([]);
  const [commandsList, setCommandsList] = useState([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [countTab, setCountTab] = useState(0);
  const [matchingItemsTab, setMatchingItemsTab] = useState(null);
  const cmdRef = useRef(null);
  const textareaRef = useRef(null);

  const handlePromptChange = (newValue) => {
    const updatedValue = newValue.startsWith(currentPath)
      ? newValue
      : currentPath + newValue.substring(currentPath.length);

    setPromptValue(updatedValue);
  };

  const setInGeneralHistory = (text) =>
    setGeneralHistory((prev) => [...prev, text]);

  const handleCommands = (e) => {
    const commands = promptValue.substring(currentPath.length).trim();
    const commandList = commands.split('&').map((command) => command.trim());
    let currentFolderObj = findObject(rootFolder, currentFolder.name, true);
    const updateCurrentFolderObj = (newObj) => (currentFolderObj = newObj);

    for (const command of commandList) {
      const parts = command.split(' ');
      const mainCommand = parts[0].toLowerCase();
      const argumentsCommand = parts.slice(1).join(' ').split('/');
      const reservedCommands = {
        color: () => handleStyleTextarea(argumentsCommand),
        cls: () => handleClear(e),
        cd: () =>
          handleCDFolders(
            e,
            argumentsCommand,
            currentFolderObj,
            updateCurrentFolderObj
          ),
        dir: () => handleDirFolders(e, currentFolderObj),
        mkdir: () =>
          handleCreateAndDeleteFolders(
            argumentsCommand,
            currentFolderObj,
            'create'
          ),
        rmdir: () =>
          handleCreateAndDeleteFolders(
            argumentsCommand,
            currentFolderObj,
            'delete'
          ),
        help: () => handleHelp(reservedCommands, argumentsCommand),
      };

      const regex =
        /^(?:'[^']*'|"[^"]*"|[_a-zA-Z][_a-zA-Z0-9]*|\.\.|[-_a-zA-Z][-_a-zA-Z0-9]*)\.(exe)$/;

      if (command.match(regex)) {
        const executable = findObject(
          rootFolder,
          currentFolder.name,
          true
        ).files.find(
          (file) =>
            file.name.toLowerCase() ===
            command
              .toLowerCase()
              .replace(`.${file.extension}`, '')
              .replace(/^["']|['"]$/g, '') +
              `.${file.extension}`
        );

        return openWindow(executable);
      }

      if (reservedCommands.hasOwnProperty(mainCommand)) {
        reservedCommands[mainCommand]();
      } else {
        setInGeneralHistory(
          `'${command}' não é reconhecido como um comando interno ou externo, um programa operável ou um arquivo em lotes.`
        );
      }
    }
  };

  function handleClear(e) {
    e.preventDefault();
    setGeneralHistory([]);
  }

  function handleHelp(reservedCommands, argumentsCommand) {
    const commandsDescription = {
      color:
        'COLOR - Define as cores padrão do primeiro plano e da tela de fundo do console.',
      cls: 'CLS - Limpa a tela.',
      cd: 'CD - Exibe o nome do diretório atual ou faz alterações nele.',
      dir: 'DIR - Exibe uma lista de arquivos ou subdiretórios em um diretório.',
      mkdir: 'MKDIR - Cria um diretório.',
      rmdir: 'RMDIR - Remove um diretório.',
      help: 'HELP - Fornece informações de ajuda sobre comandos do Windows.',
    };

    if (reservedCommands.hasOwnProperty(argumentsCommand[0])) {
      return setInGeneralHistory(commandsDescription[argumentsCommand[0]]);
    }

    for (const command in reservedCommands) {
      setInGeneralHistory(commandsDescription[command]);
    }
  }

  function handleCreateAndDeleteFolders(
    argumentsCommand,
    currentFolderObj,
    action
  ) {
    if (argumentsCommand.length > 1)
      return setInGeneralHistory('A sintaxe do comando está incorreta.');

    const pathsToBeCreate =
      /^"[^"]*"$/.test(argumentsCommand[0]) ||
      /^[\w_]+$/.test(argumentsCommand[0])
        ? argumentsCommand
        : argumentsCommand[0].split(' ');
    let folderByCreated = currentFolderObj;

    pathsToBeCreate.forEach((path) => {
      const name = pathsToBeCreate[0].includes('\\')
        ? pathsToBeCreate[0].split('\\')[0]
        : path.replace(/["']/g, '');
      const exists = currentFolderObj.subfolders.some(
        (subfolder) => subfolder.name.toLowerCase() === name.toLowerCase()
      );

      if (action === 'create') {
        if (!exists) {
          if (pathsToBeCreate[0].includes('\\')) {
            const folders = pathsToBeCreate[0]
              .split('\\')
              .filter((name) => name !== '');

            for (let folderName of folders) {
              createFolder(folderName, folderByCreated);
              folderByCreated = findObject(rootFolder, folderName, true);
            }

            return;
          }

          createFolder(name, folderByCreated);
        } else {
          setInGeneralHistory(`Já existe uma subpasta ou um arquivo ${path}.`);

          pathsToBeCreate.length > 1 &&
            setInGeneralHistory(`Erro ao processar: ${path}.`);
        }
      } else if (action === 'delete') {
        if (exists) {
          deleteFolder(name, folderByCreated);
        } else {
          setInGeneralHistory(
            'O sistema não pode encontrar o arquivo especificado.'
          );
        }
      }
    });
  }

  function handleDirFolders(e, currentFolderObj) {
    e.preventDefault();
    const subfoldersAndFiles = currentFolderObj.subfolders
      .filter((subfolder) => subfolder.name !== 'Acesso rápido')
      .concat(currentFolderObj.files);

    subfoldersAndFiles.length &&
      setGeneralHistory((prev) => [...prev, subfoldersAndFiles]);
  }

  function handleCDFolders(
    e,
    pathFolders,
    currentFolderObj,
    updateCurrentFolderObj
  ) {
    e.preventDefault();
    let newCurrentObj;

    const cleanedPathNames = pathFolders.map((pathFolder) =>
      pathFolder.replace(/^['"]|['"]$/g, '')
    );

    if (cleanedPathNames[0] === '..' && currentFolderObj.parent) {
      newCurrentObj = currentFolderObj.parent;
    } else {
      newCurrentObj = cleanedPathNames.reduce(
        (accumulator, currentPathName) =>
          findChildrenFolder(accumulator, currentPathName),
        currentFolderObj
      );
    }
    if (newCurrentObj) {
      setCurrentFolder(newCurrentObj);
      setCurrentPath(`${newCurrentObj.path}>`);
      setPromptValue(`${newCurrentObj.path}>`);
      updateCurrentFolderObj(newCurrentObj);
    } else {
      setInGeneralHistory(
        `O sistema não pode encontrar o caminho especificado.`
      );
    }
  }

  const handleStyleTextarea = (index) => {
    const theme = themes[index] ? themes[index] : textareaStyle;
    setTextareaStyle(theme);
  };

  const scrollCmdRefToBottom = () =>
    (cmdRef.current.scrollTop = cmdRef.current.scrollHeight);

  const handleKeyAction = (e) => {
    if (e.key === 'Backspace') {
      setMatchingItemsTab(null);
      setCountTab(0);
    }

    const actions = {
      Enter: () => {
        const currentCommand = promptValue.substring(currentPath.length);
        setInGeneralHistory(`${currentPath}${currentCommand}`);
        setPromptValue(currentPath);
        setCommandsList((prev) => [...prev, currentCommand]);
        handleCommands(e);
        setCurrentCommandIndex((prev) => prev + 1);
        setMatchingItemsTab(null);
        setCountTab(0);
      },
      Tab: () => {
        const currentPrompt = promptValue.substring(currentPath.length);
        const currentFolderObj = findObject(
          rootFolder,
          currentFolder.name,
          true
        );
        const subfoldersOfCurrentFolder = currentFolderObj.subfolders
          ?.filter((subfolder) => subfolder.name !== 'Acesso rápido')
          .concat(currentFolderObj.files);

        let updatedPrompt;

        const lastCharacter = currentPrompt[currentPrompt.length - 1];
        const words = currentPrompt.split(' ');
        const lastSetQuotes = currentPrompt.match(/"[^"]*"(?=[^"]*$)/);
        const wordComplete = lastSetQuotes
          ? lastSetQuotes[0]
          : words[words.length - 1];
        const currentMatchingItemsTab = matchingItemsTab
          ? matchingItemsTab
          : subfoldersOfCurrentFolder.filter((obj) =>
              obj.name.toLowerCase().startsWith(wordComplete.toLowerCase())
            );

        if (
          lastCharacter?.match(/[a-zA-Z'"]/) &&
          currentMatchingItemsTab?.length > 0
        ) {
          setMatchingItemsTab(currentMatchingItemsTab);
          const promptReplace = currentMatchingItemsTab[countTab].name.includes(
            ' '
          )
            ? `"${currentMatchingItemsTab[countTab].name}"`
            : currentMatchingItemsTab[countTab].name;
          updatedPrompt =
            currentPath + currentPrompt.replace(wordComplete, promptReplace);
        }

        if (!lastCharacter || lastCharacter.includes(' ')) {
          setMatchingItemsTab(subfoldersOfCurrentFolder);
          const promptReplace = subfoldersOfCurrentFolder[
            countTab
          ].name.includes(' ')
            ? ` "${subfoldersOfCurrentFolder[countTab].name}"`
            : subfoldersOfCurrentFolder[countTab].name;
          updatedPrompt =
            currentPath +
            currentPrompt.replace(
              lastCharacter === undefined ? wordComplete : lastCharacter,
              promptReplace
            );
        }

        setPromptValue((prev) =>
          updatedPrompt === undefined ? prev : updatedPrompt
        );
        setCountTab((prev) =>
          prev >= currentMatchingItemsTab.length - 1 ? 0 : prev + 1
        );
      },
      ArrowUp: () => {
        if (
          currentCommandIndex - 1 < commandsList.length &&
          currentCommandIndex > 0
        ) {
          setCurrentCommandIndex(currentCommandIndex - 1);
          setPromptValue(currentPath + commandsList[currentCommandIndex - 1]);
        }
      },
      ArrowDown: () => {
        if (
          currentCommandIndex < commandsList.length &&
          currentCommandIndex !== commandsList.length
        ) {
          setCurrentCommandIndex(currentCommandIndex + 1);
          setPromptValue(
            currentCommandIndex >= commandsList.length - 1
              ? currentPath
              : `${currentPath}${commandsList[currentCommandIndex + 1]}`
          );
        }
      },
      _arrowsLRDefaultMoviment: (direction) => {
        const cursorPosition = e.target.selectionStart;
        const inputValue = e.target.value;

        if (
          inputValue.substring(0, cursorPosition).length <=
            currentPath.length &&
          direction === 'left'
        ) {
          e.preventDefault();
          e.target.selectionStart = currentPath.length;
        }
      },
      ArrowLeft: () => actions._arrowsLRDefaultMoviment('left'),
      ArrowRight: () => actions._arrowsLRDefaultMoviment('right'),
    };

    const action = actions[e.key];
    if (action) {
      action.name === 'ArrowRight' || action.name === 'ArrowLeft'
        ? ''
        : e.preventDefault();
      action();
    }
  };

  useEffect(() => {
    setGeneralHistory([
      `Microsoft Windows [versão 20.2.32702.2002]
    (c) Microsoft Corporation. Todos os direitos reservados.`,
    ]);

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, []);

  useEffect(() => {
    scrollCmdRefToBottom();
  }, [generalHistory]);

  return (
    <label className="cmd" ref={cmdRef}>
      {generalHistory.length > 0 && (
        <ul className="displayCMD" style={textareaStyle}>
          {generalHistory.map((historic, index) =>
            typeof historic === 'string' ? (
              <li key={index}>{historic}</li>
            ) : (
              <li key={index}>
                {historic.map((h) => (
                  <p
                    className="lsItem"
                    style={{
                      color: h.type === 'folder' ? '#36cd7b' : '#bbd72c',
                    }}
                    key={h.name}
                  >{`${h.name}${h.type === 'folder' ? '/' : ''}`}</p>
                ))}
              </li>
            )
          )}
        </ul>
      )}
      <textarea
        className="prompt"
        ref={textareaRef}
        style={textareaStyle}
        value={promptValue}
        onChange={({ target }) => handlePromptChange(target.value)}
        onKeyDown={handleKeyAction}
      ></textarea>
    </label>
  );
}
