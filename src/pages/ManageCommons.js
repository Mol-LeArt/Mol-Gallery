import React from 'react'
import { useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import ManageCommons_Main from '../comps/ManageCommons_Main'
import ManageCommons_Bid from '../comps/ManageCommons_Bid'
import ManageCommons_Withdraw from '../comps/ManageCommons_Withdraw'
import ManageCommons_Coins from '../comps/ManageCommons_Coins'
import ManageCommons_Creator from '../comps/ManageCommons_Creator'
import ManageCommons_Remove from '../comps/ManageCommons_Remove'
import ManageCommons_Gamma from '../comps/ManageCommons_Gamma'
import ManageCommons_Fee from '../comps/ManageCommons_Fee'

const ManageCommons = () => {
  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  return (
    <div class='font-mono my-5 max-w-2xl mx-auto'>
      <ManageCommons_Main provider={provider} />
      <ManageCommons_Bid signer={signer} />
      <ManageCommons_Withdraw signer={signer} />
      <ManageCommons_Coins signer={signer} />
      <ManageCommons_Gamma signer={signer} />
      <ManageCommons_Creator signer={signer} />
      <ManageCommons_Remove signer={signer} />
      <ManageCommons_Fee signer={signer} />
    </div>
  )
}

export default ManageCommons
