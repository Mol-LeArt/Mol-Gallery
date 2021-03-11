import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ABI from './MOLVAULT_ABI'

const ManageCommons_Coins = ({ signer, commons }) => {
  const [airdrop, setAirdrop] = useState(0)
  const [updatedAirdrop, setUpdatedAirdrop] = useState('')

  const getAirdrop = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.airdrop().then((data) => {
        const a = ethers.utils.formatEther(data)
        setAirdrop(a)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const updateAirdrop = async () => {
    try {
      const a = ethers.utils.parseEther(updatedAirdrop)
      const _contract = new ethers.Contract(commons, ABI, signer)
      const tx = await _contract.updateAirdrop(a)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAirdrop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Commons Coins
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Collectors get designated airdrop amount <br /> Creators get amount x 2
      </div>
      <div>Current airdrop amount: {airdrop}</div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={updatedAirdrop}
          onChange={(e) => setUpdatedAirdrop(e.target.value)}
          placeholder='Enter new amount to airdrop'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={updateAirdrop}
        >
          Update
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Coins