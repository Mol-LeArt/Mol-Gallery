import React, { useContext} from 'react';
import { Link } from 'react-router-dom';
import Connect from './Connect'
import { CommunityContext } from '../GlobalContext'

const NavBar = () => {
  const { commons, commonsName } = useContext(CommunityContext)

  return (
    <div class='flex justify-between items-center mx-auto px-4 my-10 max-w-5xl'>
      <Link style={{ textDecoration: 'none' }} to={`/${commons}`}>
        <div
          class='flex-1 text-xl font-primary font-black tracking-wider '
          style={{ textDecoration: 'none' }}
        >
          {commonsName}
        </div>
      </Link>
      <div class='flex-2 flex space-x-8'>
        <Link style={{ textDecoration: 'none' }} to={`/${commons}/arcade`}>
          <div class='flex-1 underline'>Arcade</div>
        </Link>
        <Link style={{ textDecoration: 'none' }} to={`/${commons}/about`}>
          <div class='flex-1 underline'>About Us</div>
        </Link>
        <Connect />
      </div>
    </div>
  )
}

export default NavBar;
