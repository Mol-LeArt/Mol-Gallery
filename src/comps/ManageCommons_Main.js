import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { CommunityContext } from '../GlobalContext'

const ManageCommons_Main = ({ provider }) => {
  const [balance, setBalance] = useState('')
  const { commons } = useContext(CommunityContext)

  // ----- Get Vault  data
  const getVaultBalance = async () => {
    try {
      provider.getBalance(commons).then((data) => {
        const b = ethers.utils.formatEther(data)
        setBalance(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getVaultBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Basic
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Smart contract and its Ξ balance
      </div>
      <div> Commons Contract: {commons} </div>
      <div> Commons Balance: {balance} Ξ</div>
    </div>
  )
}

export default ManageCommons_Main
