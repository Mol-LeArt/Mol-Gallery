import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
// import ABI from '../comps/MOLGAMMA_ABI'
import { projectFirestore } from '../firebase/config'
import './Connect.css'

const Connect = () => {
  const [account, setAccount] = useState('')
  const [connect, toggleConnect] = useState(false)
  const [contract, setContract] = useState({})
  const [chain, setChain] = useState(null)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  // const signer = provider.getSigner()

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
        setChain(network.chainId)
        console.log('current chainId - ' + network.chainId)
        if (network.chainId === 100) {
          setChain('xDAI')
          toggleConnect(true)
        } else if (network.chainId === 4) {
          setChain('Rinkeby')
          toggleConnect(true)
        } else if (network.chainId === 1) {
          setChain('Mainnet')
          toggleConnect(true)
        } else if (network.chainId === 3) {
          setChain('Ropsten')
          toggleConnect(true)
        } else if (network.chainId === 42) {
          setChain('Kovan')
          toggleConnect(true)
        } else {
          console.log('Pick a supported blockchain!')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Get Account Address
  const getAccount = async () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        setAccount(result[0])
        getContract(result[0])
      })
  }

  const getContract = async (account) => {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    query.forEach((doc) => {
      // const c = new ethers.Contract(doc.data().contract, ABI, signer)
      setContract(doc.data().contract)
    })
  }

  return (
    <div>
      {!connect && <button onClick={connectMetamask}>Connect</button>}
      {connect && (
        <Link
          to={{
            pathname: `/profile/${account}`,
            state: { account: account, contract: contract },
          }}
          style={{ textDecoration: 'none' }}
        >
          <button className='connect-button'>{account.slice(0, 6) + ' ... ' + account.slice(-4)} on {chain}</button>
        </Link>
      )}
    </div>
  )
}

export default Connect
