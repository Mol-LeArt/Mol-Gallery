import React, { useState, useContext } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Remove = ({ signer }) => {
  // ----- useState
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')

  // ----- useContext
  const { commons } = useContext(CommunityContext)

  const removeGamma = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .removeGamma(tokenId)
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
        Enter token id to remove token from Commons.{' '}
      </div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
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
