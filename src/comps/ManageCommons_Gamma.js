import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import GAMMA_ABI from '../comps/MOLGAMMA_ABI'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Gamma = ({ signer }) => {
  // ----- useState
  const [gammaSupply, setGammaSupply] = useState(0)
  const [royalties, setRoyalties] = useState(0)
  const [newRoyalties, setNewRoyalties] = useState('')

  // ----- useContext
  const { commons, gamma } = useContext(CommunityContext)

  // ----- React router config
  const history = useHistory()

  const getGammaRoyalties = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .royalties()
      .then((data) => {
        const r = ethers.utils.formatUnits(data, 'wei')
        setRoyalties(Math.trunc(r))
      })
      .catch((e) => console.log(e))
  }

  const getGammaSupply = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .totalSupply()
      .then((data) => {
        const s = ethers.utils.formatUnits(data, 'wei')
        setGammaSupply(Math.trunc(s))
      })
      .catch((e) => console.log(e))
  }

  const updateRoyalties = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.updateRoyalties(newRoyalties)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getGammaRoyalties()
    getGammaSupply()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        NFT
      </div>
      <div class='pb-5 text-center text-gray-400'>Commons mints NFTs</div>
      <div>NFT Contract Address: {gamma}</div>
      <div>Total minted: {gammaSupply}</div>
      <div>Royalties: {royalties} %</div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={newRoyalties}
          onChange={(e) => setNewRoyalties(e.target.value)}
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
