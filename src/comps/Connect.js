import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
// import ABI from '../comps/MOLGAMMA_ABI'
import { projectFirestore } from '../firebase/config'
import { CommunityContext, GlobalContext } from '../GlobalContext'
// import './Connect.css'

const Connect = () => {
  // ----- useState
  // const [account, setAccount] = useState('')
  const [connect, toggleConnect] = useState(false)
  const [chain, setChain] = useState(null)

  // ----- useContext
  const { account } = useContext(GlobalContext)
  const { commons } = useContext(CommunityContext)

  const history = useHistory()
  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  // const signer = provider.getSigner()

  // Detect ACCOUNT change in Metamask and reload
  window.ethereum.on('accountsChanged', (accounts) => {
    // setAccount(accounts[0])
    history.push(`/${commons}`)
    window.location.reload()
  })

  const connectMetamask = () => {
    if (typeof window.ethereum !== undefined) {
      getNetwork()
      // getAccount()
    } else {
      console.log('No injected web3 found')
    }
  }

  const getNetwork = () => {
    provider
      .getNetwork()
      .then((network) => {
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
  // const getAccount = async () => {
  //   window.ethereum
  //     .request({ method: 'eth_requestAccounts' })
  //     .then((result) => {
  //       setAccount(result[0])
  //       getContract(result[0])
  //     })
  // }

  useEffect(() => {
    connectMetamask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {!connect && <button onClick={connectMetamask}>Connect</button>}
      {connect && (
        <Link
          to={{
            pathname: `/profile/${account}`,
          }}
        >
        <button>
          {' '}
          <span class='text-indigo-600'>
            {account.slice(0, 6) + ' ... ' + account.slice(-4)}
          </span>{' '}
          on <span class='text-red-400'>{chain}</span>
        </button>
        </Link>
      )}
    </div>
  )
}

export default Connect
