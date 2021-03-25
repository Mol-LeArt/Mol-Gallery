import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import COIN_ABI from './COIN_ABI'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Coins = ({ signer }) => {
  // ----- useState
  const [fee, setFee] = useState(0)
  const [updatedFee, setUpdatedFee] = useState('')

  // ----- useContext
  const { commons, coin } = useContext(CommunityContext)

  // ----- React router config
  const history = useHistory()

  const getFee = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.percFeeToCreators().then((data) => {
        const f = ethers.utils.formatUnits(data, 'wei')
        setFee(f)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const updateFee = async () => {
    const f = updatedFee * 10
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.updateFeeDistribution(updatedFee)
      tx.wait().then(() => {
        history.push(`/${commons}`)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getFee()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Transaction Fee
      </div>
      <div class='pb-5 text-center text-gray-400'>
        All sale includes a transaction fee that is split between creators. <br/> Default transactin fee is 1%. 
      </div>
      <div>Current Transaction Fee: {fee} %</div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={updatedFee}
          onChange={(e) => setUpdatedFee(e.target.value)}
          placeholder='Enter new fee percentage'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={updateFee}
        >
          Update
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Coins
