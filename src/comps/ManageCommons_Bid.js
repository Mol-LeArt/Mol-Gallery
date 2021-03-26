import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Bid = ({ signer }) => {
  // ----- useState
  const [bid, setBid] = useState('')
  const [bidder, setBidder] = useState('')
  const [bidOwners, setBidOwners] = useState([])
  const [numBidConfirmations, setNumBidConfirmations] = useState('')
  const [err, setErr] = useState(null)
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')

  // ----- useContext
  const { commons } = useContext(CommunityContext)

  // ----- React router config
  const history = useHistory()

  // ----- Get functions
  const getNumConfirmationsRequired = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .numConfirmationsRequired()
        .then((data) => setNumConfirmationsRequired(data))
    } catch (e) {
      console.log(e)
    }
  }

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

  const getBidOwners = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.getBidOwners().then((data) => {
        setBidOwners(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Execution functions
  const confirmSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.confirmBid()
      tx.wait().then(() => {
        _contract
          .numBidConfirmations()
          .then((data) => setNumBidConfirmations(data))
          setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('You have already confirmed to sell this commons!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const revokeSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.revokeBidConfirmation()
      tx.wait().then(() => {
        _contract
          .numBidConfirmations()
          .then((data) => setNumBidConfirmations(data))
        setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('Bid is not yet confirmed!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const sellVault = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.executeBid()
      tx.wait().then(() => {
        history.push(`/${commons}`)
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('You have not confirmed current bid!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const getConfirmSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .numBidConfirmations()
        .then((data) => setNumBidConfirmations(data))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getNumConfirmationsRequired()
    getConfirmSale()
    getBid()
    getBidder()
    getBidOwners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Sell Commons
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Click 'Confirm' to vote, and execute when consensus is reached.
      </div>
      <div>Highest Bid: {bid} Ξ</div>
      <div>Highest Bidder: {bidder}</div>
      <div>New Organizer(s): {bidOwners}</div>
      <div>No. Confirmations Required: {numConfirmationsRequired}</div>
      <div>No. Sell Confirmations: {numBidConfirmations}</div>
      {err && (
        <p class='text-red-400 text-base text-center'>{err}</p>
      )}
      <div class='flex space-x-4'>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'
          onClick={confirmSale}
        >
          Confirm
        </button>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'
          onClick={revokeSale}
        >
          Revoke Confirmation
        </button>
        <button
          class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md'
          onClick={sellVault}
        >
          Execute
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Bid
