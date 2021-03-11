import React, { useState } from 'react'
import { ethers } from 'ethers'
import ABI from '../comps/MOLVAULT_ABI'

const ManageCommons_Remove = ({ signer, commons}) => {
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')

  const removeGamma = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract
        .removeGamma(tokenAddress, tokenId)
        .then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div class='space-y-2 mb-10'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Remove from Commons
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Enter token address and id to remove token from Commons.{' '}
      </div>
      <div class='flex space-x-4'>
        <input
          class='flex-1 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder='Enter token address'
        />
        <input
          class='flex-1 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder='Enter token id'
        />

        <button
          class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md tracking-wider'
          onClick={removeGamma}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Remove
