import React, { useState, useEffect, useContext } from 'react'
import Arcade_Bid from '../comps/Arcade_Bid'
import Arcade_Main from '../comps/Arcade_Main'
import Arcade_Leaderboard from '../comps/Arcade_Leaderboard'
import { ethers } from 'ethers'
import { ArcadeContext } from '../GlobalContext'

const Arcade = () => {
  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  
  return (
    <div class='mx-auto px-4 my-16 max-w-2xl space-y-6 font-mono flex-col justify-center'>
      <ArcadeContext.Provider value={{ signer }}>
        <Arcade_Main />
        <Arcade_Leaderboard />
        <Arcade_Bid />
      </ArcadeContext.Provider>
    </div>
  )
}

export default Arcade
