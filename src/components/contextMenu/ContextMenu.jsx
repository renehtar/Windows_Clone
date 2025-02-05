import React, { useState, useRef, useEffect } from 'react';
import './contextMenu.scss';

const ContextMenu = () => {
  const modalRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const openModal = (content, coordinate) => {
    setModalContent(content);
    setIsOpen(true);
    setCoordinates(coordinate);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const ModalContent = () => {
    return (
      <div
        ref={modalRef}
        className={`modalContent ${isOpen ? 'visible' : ''}`}
        style={{ top: coordinates.y, left: coordinates.x }}
      >
        {modalContent}
      </div>
    );
  };

  return {
    open: openModal,
    close: closeModal,
    Content: ModalContent,
    isOpen,
  };
};

export default ContextMenu;
