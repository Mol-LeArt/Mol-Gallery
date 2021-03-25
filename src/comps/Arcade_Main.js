import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { GlobalContext, CommunityContext, ArcadeContext } from '../GlobalContext'
import COIN_ABI from '../comps/COIN_ABI'

const Arcade_Main = () => {
  const [balance, setBalance] = useState(0)
  const [totalCoins, setTotalCoins] = useState(0)
  const [percentage, setPercentage] = useState(0)

  // ----- useContext
  const { account } = useContext(GlobalContext)
  const { coin } = useContext(CommunityContext)
  const { signer } = useContext(ArcadeContext)

  const getUserCoinBalance = async () => {
    try {
      const _contract = new ethers.Contract(coin, COIN_ABI, signer)
      _contract.balanceOf(account).then((data) => {
        const balance = ethers.utils.formatEther(data.toString())
        setBalance(Math.trunc(balance))
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getCoinSupply = async () => {
    try {
      const _contract = new ethers.Contract(coin, COIN_ABI, signer)
      _contract.totalSupply().then((data) => {
        const balance = ethers.utils.formatEther(data.toString())
        setTotalCoins(Math.trunc(balance))
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getPercentage = () => {
    const perc = balance / totalCoins * 100
    setPercentage(Math.trunc(perc))
  }

  useEffect(() => {
    getUserCoinBalance()
    getCoinSupply()

    if (balance && totalCoins) {
      getPercentage()
    }
    return () => {}
  }, [balance, totalCoins])

  return (
    <div class='space-y-2'>
      <div class='text-center text-2xl'>Your Balance: {balance} 💵</div>
      <div class='pb-5 text-center text-gray-400'>
        Mint and buy NFT to get community coins. 
      </div>
      <div>Total in Circulation: {totalCoins} 💵</div>
      <div>You have {percentage} % voting power. </div>
    </div>
  )
}

export default Arcade_Main
