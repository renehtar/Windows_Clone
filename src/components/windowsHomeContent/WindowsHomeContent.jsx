import React, { useContext } from 'react';
import { BarsOutlined } from '@ant-design/icons';
import dataApps from '../../utils/windowsStartApps';
import './windowsHomeContent.scss';
import Icon from '../icon/Icon';
import { startWindowsContext } from '../modalStartWindows/ModalStartWindows';

export default function WindowsHomeContent({
  active,
  focusedApp,
  setWindowsHomeActive,
}) {
  const { setIsActive } = useContext(startWindowsContext);

  const handleWindowsShutdown = () => {
    setIsActive(true);
    setWindowsHomeActive(false);
  };

  return (
    <ul
      className={`windowsHomeContent ${
        active && focusedApp === 'init' ? 'active' : ''
      }`}
    >
      <li
        className="index column"
        style={{ transition: active && '0.25s ease-out' }}
      >
        <span className="init">
          <BarsOutlined />
          <p>Iniciar</p>
        </span>
        <ul className="programs">
          {dataApps.index.apps.map((app) => (
            <li
              className="program"
              onClick={app.name === 'Desligar' ? handleWindowsShutdown : null}
              key={app.name}
            >
              <Icon className="icon" src={app.icon} alt="" />
              <p>{app.name}</p>
            </li>
          ))}
        </ul>
      </li>
      <li className="column" style={{ transition: active && '0.27s ease-out' }}>
        <p>Sugeridos</p>
        <ul className="programs">
          {dataApps.suggested.apps.sort().map((app) => (
            <li className="program" key={app.name}>
              <Icon className="icon" src={app.icon} alt="" />
              <p>{app.name}</p>
            </li>
          ))}
        </ul>
      </li>
      <li className="column" style={{ transition: active && '0.29s ease-out' }}>
        <div className="categories">
          <p>Produtividade</p>
          <ul className="programs">
            {dataApps.productivity.apps.map((app) => (
              <li className="program" key={app.name}>
                <Icon className="icon" src={app.icon} alt="" />
                <p>{app.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="categories">
          <p>Explorar</p>
          <ul className="programs">
            {dataApps.toExplore.apps.map((app) => (
              <li className="program" key={app.name}>
                <Icon className="icon" src={app.icon} alt="" />
                <p>{app.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  );
}
