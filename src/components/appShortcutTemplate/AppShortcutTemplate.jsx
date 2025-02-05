import React, { useRef } from 'react';
import Icon from '../icon/Icon';
import './appShortcutTemplate.scss';

export default function AppShortcutTemplate({
  openWindow,
  app,
  focusedApp,
  setFocusedApp,
  index,
}) {
  const appRef = useRef(null);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const elementWidth = 64;
  const elementHeight = 108;
  const gap = 7;

  const elementsInWidth = Math.floor(
    (screenWidth - 2 + gap) / (elementWidth + gap)
  );
  const elementsInHeight = Math.floor((screenHeight - 2) / elementHeight);

  const positions = [];

  for (let i = 0; i < elementsInWidth; i++) {
    for (let j = 0; j < elementsInHeight; j++) {
      const startWidth = i * (elementWidth + gap);
      const endWidth = startWidth + elementWidth - 1;
      const startHeight = j * elementHeight;
      const endHeight = startHeight + elementHeight - 1;
      positions.push({ startWidth, endWidth, startHeight, endHeight });
    }
  }

  const handleTest = (e) => {
    const elements = Array.from(
      document.getElementsByClassName('templateShortcuts')
    );

    positions.forEach((position) => {
      const hasAppInPosition = elements.some(
        (element) =>
          element.style.left === `${position.startWidth}px` &&
          element.style.top === `${position.startHeight}px`
      );

      const isMouseInPosition =
        e.clientX >= position.startWidth &&
        e.clientX <= position.endWidth &&
        e.clientY >= position.startHeight &&
        e.clientY <= position.endHeight;

      if (isMouseInPosition && !hasAppInPosition) {
        appRef.current.style.left = `${position.startWidth}px`;
        appRef.current.style.top = `${position.startHeight}px`;
      }
    });
  };

  return (
    <div
      className={`templateShortcuts ${
        focusedApp?.name === app.name && 'focused'
      }`}
      style={{
        left: `${index * (elementWidth + gap)}px`,
        top: positions[index].startWidth,
      }}
      ref={appRef}
      draggable="true"
      onDoubleClick={() => openWindow(app)}
      onClick={(e) => {
        e.stopPropagation();
        setFocusedApp(app);
      }}
      onDragEnd={handleTest}
    >
      <Icon src={app.icon} alt={app.name} draggable="false" />
      <h2>{app.name}</h2>
    </div>
  );
}
