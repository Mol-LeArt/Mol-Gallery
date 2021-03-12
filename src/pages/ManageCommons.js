import React from 'react'
import { useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import ManageCommons_Main from '../comps/ManageCommons_Main'
import ManageCommons_Funding from '../comps/ManageCommons_Funding'
import ManageCommons_Sale from '../comps/ManageCommons_Sale'
import ManageCommons_Withdraw from '../comps/ManageCommons_Withdraw'
import ManageCommons_Coins from '../comps/ManageCommons_Coins'
import ManageCommons_Creator from '../comps/ManageCommons_Creator'
import ManageCommons_Remove from '../comps/ManageCommons_Remove'
import ManageCommons_Owners from '../comps/ManageCommons_Owners'
import ManageCommons_Gamma from '../comps/ManageCommons_Gamma'

const ManageCommons = () => {
  // ----- Reacter Router Config
  const location = useLocation()
  const vault = location.state.vault

  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  return (
    <div class='font-mono max-w-2xl mx-auto'>
      <ManageCommons_Main provider={provider} signer={signer} commons={vault} />
      <ManageCommons_Funding signer={signer} commons={vault} />
      <ManageCommons_Owners signer={signer} commons={vault} />
      <ManageCommons_Sale signer={signer} commons={vault} />
      <ManageCommons_Withdraw signer={signer} commons={vault} />
      <ManageCommons_Coins signer={signer} commons={vault} />
      <ManageCommons_Gamma signer={signer} commons={vault} />
      <ManageCommons_Creator signer={signer} commons={vault} />
      <ManageCommons_Remove signer={signer} commons={vault} />
    </div>
  )
}

export default ManageCommons
