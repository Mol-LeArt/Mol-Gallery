import React from 'react';
import { Link } from 'react-router-dom';
import Connect from './Connect'

import './NavBar.css';

const NavBar = ({ galleryExists }) => {
  return (
    <div className='nav-bar'>
      <Link
        style={{ textDecoration: 'none' }}
        onClick={() => (window.location.href = '/')}
        to='/'
      >
        <div style={{ textDecoration: 'none' }} className='nav-bar-logo'>
          Mol LeArt
        </div>
      </Link>
      <div className='nav-bar-navigation'>
        {!galleryExists ? (
          <Link style={{ textDecoration: 'none' }} to='/open-gallery'>
            <div>Open a Gallery</div>
          </Link>
        ) : (
          <Link style={{ textDecoration: 'none' }} to='/gallery'>
            {galleryExists && <div>Gallery</div>}
          </Link>
        )}

        <Link style={{ textDecoration: 'none' }} to='/galleries'>
          <div>Galleries</div>
        </Link>

        <Link style={{ textDecoration: 'none' }} to='/about'>
          <div>About Us</div>
        </Link>

        <Connect />
      </div>
    </div>
  )
}

export default NavBar;
