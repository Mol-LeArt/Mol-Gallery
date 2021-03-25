import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'

const ManageCommons_Owners = ({ signer, commons }) => {
  const [numConfirms, setNumConfirms] = useState('')
  const [confirmError, setConfirmError] = useState(null)
  const [revokeError, setRevokeError] = useState(null)
  const [numConfirmsRequired, setNumConfirmsRequired] = useState('')
  const [newOwners, setNewOwners] = useState('')
  const [owners, setOwners] = useState('')

  const getNumConfirmationsRequired = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .numConfirmationsRequired()
        .then((data) => setNumConfirmsRequired(data))
    } catch (e) {
      console.log(e)
    }
  }

  const confirmOwnersUpdate = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.confirmOwnersUpdate()
      tx.wait().then(() => {
        _contract
          .numProposedOwnersConfirmations()
          .then((data) => setNumConfirms(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setConfirmError(
          'You have already confirmed to withdraw funds from the vault!'
        )
      }
    }
  }

  const revokeOwnersUpdate = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.revokeOwnersUpdate()
      tx.wait().then(() => {
        _contract
          .numProposedOwnersConfirmations()
          .then((data) => setNumConfirms(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setRevokeError(
          'You have already revoked your vote to withdraw funds!'
        )
      }
    }
  }

  const updateOwners = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.updateOwners()
    } catch (e) {
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        console.log(e.message)
      }
    }
  }

  const getNumConfirms = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .numProposedOwnersConfirmations()
        .then((data) => setNumConfirms(data))
    } catch (e) {
      console.log(e)
    }
  }

  const proposeOwners = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.proposeOwners([newOwners])
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }
  
  const getProposedOwners = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.getProposedOwners().then((data) => {
        setOwners(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getNumConfirms()
    getNumConfirmationsRequired()
    getProposedOwners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='font-mono space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Change Organizers
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Click 'Confirm' to vote, and change organizers when consensus reached.
      </div>
      <div>No. Confirmations Required: {numConfirmsRequired}</div>
      <div>No. Confirmations : {numConfirms}</div>
      <div>Proposed Owners : {owners}</div>
      {confirmError && <p>{confirmError}</p>}
      {revokeError && <p>{revokeError}</p>}
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={newOwners}
          onChange={(e) => setNewOwners(e.target.value)}
          placeholder='Enter new organizers'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={proposeOwners}
        >
          Propose
        </button>
      </div>
      <div class='flex space-x-4'>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'
          onClick={confirmOwnersUpdate}
        >
          Confirm
        </button>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'
          onClick={revokeOwnersUpdate}
        >
          Revoke Confirmation
        </button>
        <button
          class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md'
          onClick={updateOwners}
        >
          Change
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Owners
