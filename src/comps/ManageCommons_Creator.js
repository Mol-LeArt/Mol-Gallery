import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ABI from '../comps/MOLVAULT_ABI'

const ManageCommons_Creator = ({ signer, commons}) => {
  const [creators, setCreators] = useState([])
  const [creatorToAdd, setCreatorToAdd] = useState('')
  const [creatorToRemove, setCreatorToRemove] = useState('')

  const getWhitelist = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.getWhitelist().then((data) => {
        setCreators(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const addToWhitelist = async () => {
    try {
      const artist = [creatorToAdd]
      const _contract = new ethers.Contract(commons, ABI, signer)
      const tx = await _contract.addToWhitelist(artist)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  const removeFromWhitelist = async () => {
    try {
      const artist = [creatorToRemove]
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.removeFromWhitelist(artist).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getWhitelist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Creator Roster
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Enter token address and id to remove token from Commons.{' '}
      </div>
      {creators && (
        <div>
          {creators.map((artist, index) => (
            <p key={index}>{artist}</p>
          ))}
        </div>
      )}
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={creatorToAdd}
          onChange={(e) => setCreatorToAdd(e.target.value)}
          placeholder='Enter artist address'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={addToWhitelist}
        >
          Add
        </button>
      </div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={creatorToRemove}
          onChange={(e) => setCreatorToRemove(e.target.value)}
          placeholder='Enter artist address'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md tracking-wider'
          onClick={removeFromWhitelist}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Creator
