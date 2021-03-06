import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Creator = ({ signer }) => {
  // ----- useState
  const [creators, setCreators] = useState('')
  const [creatorToAdd, setCreatorToAdd] = useState('')
  const [creatorToRemove, setCreatorToRemove] = useState('')

  // ----- useContext
  const { commons } = useContext(CommunityContext)

  // ----- React router config
  const history = useHistory()

  const getCreators = async () => {
    const _creators = []
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      
      // brute force iteration up to 3 minters, otherwise would rely on backend to retrieve minters list
      for (var i = 0; i < 3; i++) {
        _contract.minters(i).then((data) => {
          _creators.push(data)
          setCreators([..._creators])
        })
      }
      
    } catch (e) {
      console.log(e)
    }
  }

  const addCreator = async () => {
    try {
      // const artist = [creatorToAdd]
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const _creators = [...creators, creatorToAdd]
      const tx = await _contract.updateMinter(_creators)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  const removeCreator = async () => {
    try {
      // const artist = [creatorToRemove]
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const _creators = creators.filter(creator => creator !== creatorToRemove)
      const tx = await _contract.updateMinter(_creators)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getCreators()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Creator Roster
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Add or remove a creator by entering her Eth address below.{' '}
      </div>
      {creators && (
        <div>
          {creators && creators.map((creator, index) => (
            <div id={index}>{index+1}.{creator}</div>
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
          onClick={addCreator}
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
          onClick={removeCreator}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default ManageCommons_Creator
