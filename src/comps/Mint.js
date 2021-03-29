import React, { useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import fleek from '@fleekhq/fleek-storage-js'
import MOLCOMMONS_ABI from '../comps/MOLCOMMONS_ABI'
import {firebaseFieldValue, projectFirestore} from '../firebase/config'
import { ethers } from 'ethers'
import { CommunityContext } from '../GlobalContext'


const Mint = ({ metadata, sale, ethPrice, coinPrice, img }) => {
  // ----- useContext
  const { commons } = useContext(CommunityContext)
  
  // ----- Reaect Router Config
  const history = useHistory()

  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- Upload image to Fleek Storage
  const upload = async (data, contract) => {
    const input = {
      apiKey: process.env.REACT_APP_FLEEK_API_KEY,
      apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
      bucket: 'audsssy-team-bucket',
      key: metadata.title,
      data,
    }

    try {
      const result = await fleek.upload(input)
      console.log('this is image hash from fleek - ' + result.hash)

      // Prepare to mint NFT
      uploadAndMint(result.hash)
    } catch (e) {
      console.log('error is - ' + e)
    }
  }

  // ----- Upload tokenURI and Mint NFT
  const uploadAndMint = async (hash) => {
    const baseUrl = 'https://ipfs.io/ipfs/'

    // Add timestamp to metadata
    const date = new Date()
    const timestamp = date.getTime()
    const dict = { ...metadata, image: baseUrl + hash, createdAt: timestamp }
    console.log('tokenURI at mint is - ', dict)

    const data = JSON.stringify(dict)
    const i = {
      apiKey: process.env.REACT_APP_FLEEK_API_KEY,
      apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
      bucket: 'audsssy-team-bucket',
      key: hash,
      data,
    }

    try {
      // Uplaod tokenUri to Fleek
      const result = await fleek.upload(i)
      console.log('this is tokenUri hash from fleek - ' + result.hash)

      // Mint NFT
      const tokenUri = baseUrl + result.hash
      console.log(tokenUri)
      const p = ethers.utils.parseEther(ethPrice)
      const c = ethers.utils.parseEther(coinPrice)
      molCommons(p, c, tokenUri)
  
    } catch (e) {
      console.log('error is - ' + e, i)
    }
  }

  // ----- Mint Gamma with MolVault
  const molCommons = async (price, coins, tokenURI) => {
    console.log('MolVault contract is - ', commons)
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      const tx = await _contract.mint(price, coins, tokenURI, sale)
      console.log('tx.hash for minting - ' + tx.hash)

      tx.wait().then((receipt) => {
        if (receipt.confirmations === 1) {
          console.log('mint receipt is - ', receipt)
          history.push(`/community`)

          // Store user address to Firestore
          addMinterToCoinHolders()
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Listen to contract events
  // function contractListener(contract) {
  //   contract.on('Transfer', (from, to, tokenId) => {
  //     console.log('Token minted - ', from, to)
  //     console.log('NFT tokenId minted - ' + tokenId)
  //   })

  //   contract.on('gRoyaltiesMinted', (contractAddress) => {
  //     console.log('gRoyalties minted at contract address  - ', contractAddress)
  //   })
  // }

  // Add minter to Firestore
  const addMinterToCoinHolders = async () => {
    console.log(commons)
    const docRef = projectFirestore.collection('vault').doc(commons)   
    
    signer.getAddress().then(address => {
      console.log(address)
       docRef.update({
         holders: firebaseFieldValue.arrayUnion(address),
       }) 
    })
  }

  useEffect(() => {
    upload(img)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div></div>
}

export default Mint
