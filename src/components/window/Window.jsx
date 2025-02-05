import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './window.scss';
import {
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  MinusOutlined,
} from '@ant-design/icons';

export default function Window({
  windowApp,
  img,
  onClose,
  onMinimize,
  setActiveWindow,
  isActive,
  children,
}) {
  const standardWindowSize = { width: 450, height: 300 };
  const [size, setSize] = useState(standardWindowSize);
  const [position, setPosition] = useState({
    x: Math.random() * (window.innerWidth - standardWindowSize.width),
    y: Math.random() * (window.innerHeight - (standardWindowSize.height + 80)),
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [originalSize, setOriginalSize] = useState(size);
  const [originalPosition, setOriginalPosition] = useState(position);

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(originalSize);
      setPosition(originalPosition);
    } else {
      setOriginalSize(size);
      setOriginalPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };

  const handlePosition = (e, d) => {
    const maxXPosition =
      window.innerWidth - parseInt(String(size.width).replace(/px$/, '')) - 1;

    setPosition({ x: d.x, y: d.y });

    if (
      ((d.x <= 0 || d.x >= maxXPosition) && !isMaximized) ||
      (d.y <= 0 && !isMaximized)
    )
      toggleMaximize();
  };

  useEffect(() => setActiveWindow(), []);

  return (
    <Rnd
      className={`window ${isActive && 'active'} ${
        isMaximized && 'maximized'
      } ${windowApp.isMinimized && 'minimized'}`}
      size={size}
      position={position}
      onDragStop={handlePosition}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({ width: ref.style.width, height: ref.style.height });
        setPosition({ ...position });
      }}
      bounds="window"
      dragHandleClassName="title-bar"
      onMouseDown={setActiveWindow}
      minWidth={300}
      minHeight={160}
    >
      <div className="title-bar">
        <div className="title" onDoubleClick={toggleMaximize}>
          <img src={img} />
          {windowApp.title}
        </div>
        <div className="buttons">
          <button className="button minimize-button" onClick={onMinimize}>
            <MinusOutlined />
          </button>
          <button className="button maximize-button" onClick={toggleMaximize}>
            {isMaximized ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </button>
          <button className="button close-button" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
      </div>
      <div className="content">{children}</div>
    </Rnd>
  );
}
