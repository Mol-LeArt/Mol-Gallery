import React, { useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import Connect from './Connect'
import { ethers } from 'ethers'
import { GlobalContext, CommunityContext } from '../GlobalContext'

import './NavBar.css';

const NavBar = ({  }) => {
  const [menuItem, setMenuItem] = useState('commons')
  const { account, hasGallery } = useContext(GlobalContext)
  const { contract } = useContext(CommunityContext)

  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  return (
    <div class='flex justify-between items-center mx-auto px-4 my-10 max-w-5xl font-mono'>
      <Link
        style={{ textDecoration: 'none' }}
        to={`/${contract}`}
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
          <Link
            style={{ textDecoration: 'none' }}
            to={`/${contract}/open-gallery`}
          >
            <div class='flex-1 underline'>Open a Gallery</div>
          </Link>
        ) : (
          ''
        )}

        <Link
          style={{ textDecoration: 'none' }}
          to={`/${contract}/arcade`}
        >
          <div class='flex-1 underline'>Arcade</div>
        </Link>

        <Link
          style={{ textDecoration: 'none' }}
          to={`/${contract}/galleries`}
        >
          <div class='flex-1 underline'>Galleries</div>
        </Link>

        <Link
          style={{ textDecoration: 'none' }}
          to={`/${contract}/about`}
        >
          <div class='flex-1 underline'>About Us</div>
        </Link>

        <Connect />
      </div>
    </div>
  )
}

export default NavBar;
