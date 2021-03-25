import React, { useState, useEffect, useContext } from 'react'
import { projectFirestore } from '../firebase/config'
import { ethers } from 'ethers'
import { CommunityContext, ArcadeContext } from '../GlobalContext'
import COIN_ABI from '../comps/COIN_ABI'

const Arcade_Leaderboard = () => {
  // ----- useState
  const [holders, setHolders] = useState([])

  // ----- useContext
  const { commons, coin } = useContext(CommunityContext)
  const { signer } = useContext(ArcadeContext)

  const getCoinHolders = async () => {
    const query = await projectFirestore
      .collection('vault')
      .where('contract', '==', commons)
      .get()
    query.forEach((doc) => {
      const _holders = doc.data().holders
      if (_holders) {
        getUserCoinBalance(_holders)
      }
    })
  }

  const getUserCoinBalance = async (addresses) => {
    const _holders = []
    const _contract = new ethers.Contract(coin, COIN_ABI, signer)

    for (let i = 0; i < addresses.length; i++) {
      try {
        _contract.balanceOf(addresses[i]).then((data) => {
          const balance = ethers.utils.formatEther(data.toString())
          const _holder = {
            address: addresses[i],
            balance: balance,
          }
          _holders.push(_holder)
          _holders.sort((a, b) => b.balance - a.balance)
          setHolders([..._holders])
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    getCoinHolders()
    return () => {}
  }, [])

  return (
    <div class='space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Leaderboard
      </div>
      {holders &&
        holders.map((holder, index) => (
          <div key={index} class='flex items-center mx-auto'>
            <div class='flex-1'>{index+1}. {holder.address}</div>
            <div class='flex-2'>{holder.balance}</div>
          </div>
        ))}
    </div>
  )
}

export default Arcade_Leaderboard
