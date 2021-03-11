import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ABI from './MOLVAULT_ABI'

const ManageCommons_Sale = ({ signer, commons}) => {
  const [bid, setBid] = useState('')
  const [bidder, setBidder] = useState('')
  const [bidOwners, setBidOwners] = useState([])
const [numSaleConfirmations, setNumSaleConfirmations] = useState('')
const [confirmSaleError, setConfirmSaleError] = useState(null)
const [revokeSaleError, setRevokeSaleError] = useState(null)
const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')

const getNumConfirmationsRequired = async () => {
  try {
    const _contract = new ethers.Contract(commons, ABI, signer)
    _contract
      .numConfirmationsRequired()
      .then((data) => setNumConfirmationsRequired(data))
  } catch (e) {
    console.log(e)
  }
}

  const getBid = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
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
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.bidder().then((data) => {
        setBidder(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getBidOwners = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.getBidOwners().then((data) => {
        setBidOwners(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Sell vault
  const confirmSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      const tx = await _contract.confirmSale()
      tx.wait().then(() => {
        _contract
          .numSaleConfirmations()
          .then((data) => setNumSaleConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setConfirmSaleError(
          'You have already confirmed to withdraw funds from the vault!'
        )
      }
    }
  }

  const revokeSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      const tx = await _contract.revokeSale()
      tx.wait().then(() => {
        _contract
          .numSaleConfirmations()
          .then((data) => setNumSaleConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setRevokeSaleError(
          'You have already revoked your vote to sell the vault!'
        )
      }
    }
  }

  const sellVault = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.sellVault()
    } catch (e) {
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        console.log(e)
      }
    }
  }

  const getConfirmSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract
        .numSaleConfirmations()
        .then((data) => setNumSaleConfirmations(data))
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
    <div class='font-mono space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Sell Commons
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Click 'Confirm' to vote, and execute when consensus reached.
      </div>
      <div>Highest Bid: {bid} Ξ</div>
      <div>Highest Bidder: {bidder}</div>
      <div>New Organizer(s): {bidOwners}</div>
      <div>
        No. Confirmations Required: {numConfirmationsRequired}
      </div>
      <div>No. Sell Confirmations: {numSaleConfirmations}</div>
      {confirmSaleError && <p>{confirmSaleError}</p>}
      {revokeSaleError && <p>{revokeSaleError}</p>}
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

export default ManageCommons_Sale
