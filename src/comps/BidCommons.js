import React, { useState } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'

const BidCommons = ({ vault, setIsBidForm }) => {
  const [bid, setBid] = useState('')
  const [proposedOwners, setProposedOwners] = useState('')

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- Bid
  const bidVault = async () => {
    const _contract = new ethers.Contract(vault, MOLCOMMONS_ABI, signer)
    try {
      const newOwners = [proposedOwners]
      const overrides = { value: ethers.utils.parseEther(bid) }
      console.log(_contract)
      const tx = await _contract.bidCommons(newOwners, overrides)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  const toggleBidForm = () => {
    setIsBidForm(false)
  }

  return (
    <div class='flex-col text-center space-y-4'>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 rounded focus:outline-none focus:border-gray-900 font-mono'
          type='text'
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder='Enter bid'
        />
      </div>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 rounded focus:outline-none focus:border-gray-900 font-mono'
          type='text'
          value={proposedOwners}
          onChange={(e) => setProposedOwners(e.target.value)}
          placeholder='Enter proposed owners'
        />
      </div>
      <div class='text-sm text-gray-500'>
        *Bid amount will be locked in commons until bid is withdrawn or accepted
      </div>
      <div class='space-x-4'>
        <button
          class='py-2 px-4 text-white bg-gray-700 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'
          onClick={bidVault}
        >
          Bid on Vault
        </button>
        <button
          class='py-2 px-4 text-white hover:bg-red-500 w-max rounded-md tracking-wider bg-red-600 opacity-75 font-mono'
          onClick={toggleBidForm}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default BidCommons
