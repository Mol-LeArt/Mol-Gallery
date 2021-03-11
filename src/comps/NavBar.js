import React from 'react';
import { Link } from 'react-router-dom';
import Connect from './Connect'

import './NavBar.css';

const NavBar = ({ hasGallery }) => {
  return (
    <div class='flex justify-between items-center mx-auto px-4 my-10 max-w-5xl font-mono'>
      <Link
        style={{ textDecoration: 'none' }}
        onClick={() => (window.location.href = '/')}
        to='/'
      >
        <div
          class='flex-1 text-xl font-primary font-black tracking-wider '
          style={{ textDecoration: 'none' }}
        >
          Mol LeArt
        </div>
      </Link>
      <div class='flex-2 flex space-x-8'>
        {/* use whitelist from vault to toggle  */}
        {!hasGallery ? (
          <Link style={{ textDecoration: 'none' }} to='/open-gallery'>
            <div class='flex-1 underline'>Open a Gallery</div>
          </Link>
        ) : (
          ''
        )}

        <Link style={{ textDecoration: 'none' }} to='/arcade'>
          <div class='flex-1 underline'>Arcade</div>
        </Link>

        <Link style={{ textDecoration: 'none' }} to='/galleries'>
          <div class='flex-1 underline'>Galleries</div>
        </Link>
        
        <Link style={{ textDecoration: 'none' }} to='/about'>
          <div class='flex-1 underline'>About Us</div>
        </Link>

        <Connect />
      </div>
    </div>
  )
}

export default NavBar;
