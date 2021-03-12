import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ABI from './MOLVAULT_ABI'

const ManageCommons_Gamma = ({ signer, commons }) => {
  const [royalties, setRoyalties] = useState(0)
  const [updatedRoyalties, setUpdatedRoyalties] = useState('')

  const getRoyalties = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.airdrop().then((data) => {
        const a = ethers.utils.formatEther(data)
        setRoyalties(a)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const updateRoyalties = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      const tx = await _contract.updateRoyalties(updatedRoyalties)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getRoyalties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Gamma
      </div>
      <div class='pb-5 text-center text-gray-400'>Commons mints Gamma</div>
      <div>Royalties: {royalties} %</div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={updatedRoyalties}
          onChange={(e) => setUpdatedRoyalties(e.target.value)}
          placeholder='Enter new royalties %'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={updateRoyalties}
        >
          Update
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Gamma
