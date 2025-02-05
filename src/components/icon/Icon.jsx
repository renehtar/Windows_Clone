import React from 'react';
import './icon.scss';

export default function Icon({ ...props }) {
  return <img className="image" {...props} />;
}
