import React from "react";

import './MenuBar.css'

import { useNavigate } from 'react-router-dom';


function MenuBar() {
    const navigate = useNavigate();

  return (
    <div className="menu-bar">
      <ul className="menubar-items">
        <li onClick={() => navigate('/')}>🏠</li>
        <li onClick={() => navigate('/Feedback')}>🗣</li>
        <li onClick={() => navigate('/')}>⚙</li>
      </ul>
    </div>
  );
}

export default MenuBar;