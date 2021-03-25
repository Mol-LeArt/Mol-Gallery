import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Withdraw = ({signer}) => {
    const [
      numWithdrawalConfirmations,
      setNumWithdrawalConfirmations,
    ] = useState('')
    const [confirmWithdrawalError, setConfirmWithdrawalError] = useState(null)
    const [revokeWithdrawalError, setRevokeWithdrawalError] = useState(null)
    const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')

    const { commons } = useContext(CommunityContext)

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

  const confirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.confirmWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setConfirmWithdrawalError(
          'You have already confirmed to withdraw funds from the vault!'
        )
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
      })
    } catch (e) {
      setRevokeWithdrawalError(
        'Withdrawal is not yet confirmed!'
      )

      // console.log(e.code)
      // if (e.code === 4001) {
      //   console.log(e.message)
      // } else {
      //   setRevokeWithdrawalError(
      //     'You have already revoked your vote to withdraw funds!'
      //   )
      // }
    }
  }

  const executeWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.executeWithdrawal()
    } catch (e) {
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        console.log(e.message)
      }
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

  useEffect(() => {
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
        Click 'Confirm' to vote, and withdraw when consensus reached.
      </div>
      <div>No. Confirmations Required: {numConfirmationsRequired}</div>
      <div>No. Withdrawal Confirmations: {numWithdrawalConfirmations}</div>
      {confirmWithdrawalError && (
        <p class='text-red-400 text-base text-center'>{confirmWithdrawalError}</p>
      )}
      {revokeWithdrawalError && (
        <p class='text-red-400 text-base text-center'>{revokeWithdrawalError}</p>
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
        <button
          class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md'
          onClick={executeWithdrawal}
        >
          Execute
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Withdraw
