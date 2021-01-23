import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

async function connectMetamask() {
  if (typeof window.ethereum !== undefined) {
    await window.ethereum.enable()
  } else {
    console.log('No injected web3 found')
  }
}

const Connect = () => {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState(0)
  const [connect, toggleConnect] = useState(true)

  // Provided by ethers.js
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      window.location.reload()
    }
  })
  const signer = provider.getSigner()

  const getNetwork = () => {
    provider
      .getNetwork()
      .then((network) => {
        console.log('current chainId - ' + network.chainId)
        if (network.chainId !== 4) {
          alert('Please switch to Rinkeby Ethereum!')
          toggleConnect(true)
        } else {
          console.log("You're on Rinkeby now!")
          toggleConnect(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Get Account Address
  function getAccountAddress() {
    signer
      .getAddress()
      .then((data) => {
        console.log('address ' + data)
        setAccount(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Get Account Balance
  function getAccountBalance() {
    signer
      .getBalance()
      .then((data) => {
        data = ethers.utils.formatEther(data)
        console.log('balance ' + data)
        setBalance(data)
      })
      .catch((err) => console.log(err))
  }

  function handleClick() {
    if (account) {
      console.log('You address is - ' + account, 'Your balance is - ' + balance)
    } else {
      alert('Log in Metamask')
    }
  }

  useEffect(() => {
    connectMetamask()
    getNetwork()
    getAccountAddress()
    getAccountBalance()
  }, [])

  return (
    <div>
      <button disabled={connect} onClick={handleClick}>
        Submit
      </button>
    </div>
  )
}

export default Connect
