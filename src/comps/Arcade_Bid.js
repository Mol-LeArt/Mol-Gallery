import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { useHistory } from 'react-router-dom'
import { GlobalContext, CommunityContext, ArcadeContext } from '../GlobalContext'

import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'

const Arcade_Bid = () => {
  // ----- useState
  const [bid, setBid] = useState(null)
  const [bidder, setBidder] = useState(null)
  const [newBid, setNewBid] = useState('')
  const [err, setErr] = useState(null)

  // ----- useContext
  const { account } = useContext(GlobalContext)
  const { commons } = useContext(CommunityContext)
  const { signer } = useContext(ArcadeContext)

  // ----- React router config
  const history = useHistory()

  // ----- Get bid
  const getBid = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.bid().then((data) => {
        const b = ethers.utils.formatEther(data)
        setBid(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Get bidder
  const getBidder = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.bidder().then((data) => {
        setBidder(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Bid
  const bidCommons = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      const newOwners = [account]
      const overrides = { value: ethers.utils.parseEther(newBid) }
      console.log(newBid)
      const tx = await _contract.bidCommons(newOwners, overrides)
      tx.wait().then(() => {
        getBid()
        getBidder()
        setErr('')
      })
    } catch (e) {
      console.log(e)
      setErr('You must bid higher than the highest bid!')
    }
  }

  useEffect(() => {
    getBid()
    getBidder()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Bids on Commons
      </div>
      <div class='pb-5 text-center text-gray-400'>Description</div>
      <div>Highest Bid: {bid} Ξ</div>
      <div>Highest Bidder: {bidder}</div>
      {err && <div class='text-center text-red-400'>{err}</div>}
      <div class='flex space-x-4'>
        <input
          class='flex-1 border border-gray-400 py-2 px-4 rounded focus:outline-none focus:border-gray-900 font-mono'
          type='text'
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          placeholder='Enter bid in Ξ'
        />

        <button
          class='flex-2 py-2 px-4 text-white bg-gray-700 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'
          onClick={bidCommons}
        >
          Bid on Vault
        </button>
      </div>

      <div class='text-sm text-gray-500 text-center'>
        *Bid amount will be locked in commons until bid is withdrawn or accepted
      </div>
      <div class='flex space-x-4'>
        {/* <button class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'>
          Like
        </button>
        <button class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'>
          Disklike
        </button> */}
      </div>
    </div>
  )
}

export default Arcade_Bid
