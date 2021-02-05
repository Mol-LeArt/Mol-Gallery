import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

const Connect = () => {
  const [account, setAccount] = useState('')
  const [connect, toggleConnect] = useState(false)

  // Detect Metamask and signer/wallet
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

  // Detect network change in Metamask and reload ~ provided by ethers.js
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      window.location.reload()
    }
  })

  // Detect account change in Metamask and reload
  window.ethereum.on('accountsChanged', (accounts) => {
    setAccount(accounts[0])
    window.location.reload()
  })

  async function connectMetamask() {
    if (typeof window.ethereum !== undefined) {
      getNetwork()
      getAccount()
    } else {
      console.log('No injected web3 found')
    }
  }

  const getNetwork = () => {
    provider
      .getNetwork()
      .then((network) => {
        console.log('current chainId - ' + network.chainId)
        if (network.chainId !== 100) {
          console.log('Please switch to xDAI Ethereum!')
          toggleConnect(true) // consider changing button color rather than disabling to signal incorrect network
        } else {
          console.log("You're on xDAI now!")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Get Account Address
  function getAccount() {
    window.ethereum.request({method:'eth_requestAccounts'}).then(result=>{
          console.log(result[0]);
          setAccount(result[0])
    });
  }

  // function changeButtonText(account) {   
  //   if (account){
  //     return account.slice(0, 6) + '...' + account.slice(-4)
  //   } else {
  //     return "Connect"
  //   }
  // }

  function toProfile() {
    console.log("go to profile page")
  }

  return (
    <div>
      {!connect && (
        <button disabled={connect} onClick={connectMetamask}>
          Connect
        </button>
      )}
      {connect && (
        <Link to='/profile'>
          <button onClick={toProfile}>
            {account.slice(0, 6) + ' ... ' + account.slice(-4)}
          </button>
        </Link>
      )}
    </div>
  )
}

export default Connect
