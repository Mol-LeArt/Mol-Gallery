import React, { useState, useEffect } from 'react'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import MOLCOMMONS_BYTECODE from './MOLCOMMONS_BYTECODE'
import { ContractFactory, ethers } from 'ethers'
import { projectFirestore, timeStamp } from '../firebase/config'

const DeployCommons = () => {
  // ----- useState
  const [community, setCommunity] = useState('')
  const [chain, setChain] = useState(null)

  // ----- Deploy MolVault
  const [organizer, setOrganizer] = useState('')
  const [confirmationsRequired, setConfirmationsRequired] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [deployError, setDeployError] = useState(null)
  const [commons, setCommons] = useState(null)
  const gRoyaltiesUri = 'image'

  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const factory = new ContractFactory(
    MOLCOMMONS_ABI,
    MOLCOMMONS_BYTECODE,
    signer
  )

  // ----- Deploy MolVault
  const deploy = async () => {
    if (organizer.length > 0 && confirmationsRequired > 0) {
      try {
        const _contract = await factory.deploy(
          tokenName,
          tokenSymbol,
          gRoyaltiesUri,
          [organizer],
          [organizer],
          confirmationsRequired
        )

        _contract.deployTransaction
          .wait()
          .then((receipt) => {
            setCommons(_contract.address)

            console.log('Receipt for deploying MolCommons', receipt)
            upload(community, _contract.address, [organizer])
          })
          .catch((e) => console.log(e))
      } catch (e) {
        console.log(e)
      }
    } else {
      setDeployError('You must enter owners and number of confirmations')
    }
  }

  // Upload to Firestore
  const upload = async (communityName, contract, organizers) => {
    const docRef = projectFirestore.collection('vault').doc(contract)
    const createdAt = timeStamp()
    const dict = {
      name: communityName,
      contract: contract,
      organizers: organizers,
      createdAt: createdAt,
      chain: chain,
    }
    docRef.set(dict).then(() => {
      window.location.reload()
    })
  }

  const getNetwork = () => {
    provider
      .getNetwork()
      .then((network) => {
        console.log('current chainId - ' + network.chainId)
        if (network.chainId === 100) {
          setChain('xDAI')
        } else if (network.chainId === 4) {
          setChain('Rinkeby')
        } else if (network.chainId === 1) {
          setChain('Mainnet')
        } else if (network.chainId === 3) {
          setChain('Ropsten')
        } else if (network.chainId === 42) {
          setChain('Kovan')
        } else {
          console.log('Pick a supported blockchain!')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getNetwork()
    console.log(chain)
  }, [chain])
  

  return (
    <div class='space-y-4'>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          placeholder='Enter name of community'
        />
      </div>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
          type='text'
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value.toLowerCase())}
          placeholder='Enter community organizer'
        />
      </div>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
          type='text'
          value={confirmationsRequired}
          onChange={(e) => setConfirmationsRequired(e.target.value)}
          placeholder='Number of confirmations '
        />
      </div>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
          type='text'
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder='Name of NFT'
        />
      </div>
      <div>
        <input
          class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
          type='text'
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          placeholder='Symbol of NFT'
        />
      </div>
      <button
        class='py-4 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
        onClick={deploy}
      >
        Deploy Vault
      </button>
      {deployError && <p>{deployError}</p>}
      {commons && <div> Vault Contract: {commons} </div>}
    </div>
  )
}

export default DeployCommons
