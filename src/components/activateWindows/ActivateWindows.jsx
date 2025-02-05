import React, { useState } from 'react';
import './activateWindows.scss';

export default function ActivateWindows() {
  const [hidden, setHidden] = useState(false);

  return (
    <div className={`activateWindows ${hidden && 'hidden'}`}>
      <div className="closeContainer">
        <button className="close" onClick={() => setHidden(true)}>
          X
        </button>
      </div>
      <h3>Ativar o Windows</h3>
      <span>Acesse Configurações para ativar o Windows.</span>
    </div>
  );
}
