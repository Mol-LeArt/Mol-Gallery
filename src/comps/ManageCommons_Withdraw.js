import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import { CommunityContext, GlobalContext } from '../GlobalContext'

const ManageCommons_Withdraw = ({ signer }) => {
  // ----- useState
  const [numWithdrawalConfirmations, setNumWithdrawalConfirmations] = useState(
    ''
  )
  const [err, setErr] = useState(null)
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')

  const [availableFunds, setAvailableFunds] = useState(0)
  const [fundsToWithdraw, setFundsToWithdraw] = useState('')

  // ----- useContext
  const { account } = useContext(GlobalContext)
  const { commons } = useContext(CommunityContext)

  // ----- React router config
  const history = useHistory()

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  

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

  const getConfirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .numWithdrawalConfirmations()
        .then((data) => setNumWithdrawalConfirmations(data))
    } catch (e) {
      console.log(e)
    }
  }

  const getAvailableFunds = async () => {
    const contractBalance = await provider.getBalance(commons)
    const cb = ethers.utils.formatEther(contractBalance)
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.bid().then((data) => {
        const b = ethers.utils.formatEther(data)
        const funds = cb - b
        setAvailableFunds(funds)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Execution functions
  const confirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.confirmWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
        setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('You have already confirmed to withdraw funds from the commons!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const revokeWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.revokeWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
        setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('Withdrawal is not yet confirmed!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const executeWithdrawal = async () => {
    if (availableFunds > fundsToWithdraw) {
      const f = ethers.utils.parseEther(fundsToWithdraw.toString())

      try {
        const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
        const tx = await _contract.executeWithdrawal(f, account)
        tx.wait().then(() => {
          history.push(`/${commons}`)
        })
      } catch (e) {
        if (e.code === 4001) {
          setErr('User rejected transaction!')
        } else if (e.error.code === 4001) {
          setErr('User rejected transaction!')
        } else if (Math.abs(e.error.code) === 32603) {
          setErr('You have not confirmed withdrawal!')
        } else {
          setErr('Something went wrong!')
        }
      }
    } else {
      setErr('Please specify an appropriate amount to withdraw!')
    }
    
  }

  useEffect(() => {
    getAvailableFunds()
    getConfirmWithdrawal()
    getNumConfirmationsRequired()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Withdraw Funds from Common
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Click 'Confirm' to vote, and withdraw when consensus is reached.
      </div>
      <div>Funds Available to Withdraw: {availableFunds} Ξ</div>
      <div>No. Confirmations Required: {numConfirmationsRequired}</div>
      <div>No. Withdrawal Confirmations: {numWithdrawalConfirmations}</div>
      {err && (
        <p class='text-red-400 text-base text-center'>
          {err}
        </p>
      )}
      <div class='flex space-x-4'>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'
          onClick={confirmWithdrawal}
        >
          Confirm
        </button>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'
          onClick={revokeWithdrawal}
        >
          Revoke Confirmation
        </button>
      </div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={fundsToWithdraw}
          onChange={(e) => setFundsToWithdraw(e.target.value)}
          placeholder='Enter amount in Ξ to withdraw'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={executeWithdrawal}
        >
          Withdraw
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Withdraw
