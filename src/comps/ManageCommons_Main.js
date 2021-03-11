import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const ManageCommons_Main = ({ provider, commons }) => {
  const [balance, setBalance] = useState('')

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
    <div class='space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Basic
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Smart contract and current Ξ balance
      </div>
      <div class='text-gray-600'> Vault Contract: {commons} </div>
      <div> Vault Balance: {balance} Ξ</div>
    </div>
  )
}

export default ManageCommons_Main
