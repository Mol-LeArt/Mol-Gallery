import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import fleek from '@fleekhq/fleek-storage-js'
import ABI from './MOLGAMMA_ABI'
import { ethers } from 'ethers'
import { projectFirestore } from '../firebase/config'
import './Mint.css'

const Mint = ({ contract, metadata, sale, price, img, setImg, account }) => {
  const [dict, setDict] = useState({})
  const [id, setId] = useState(null)
  const [royaltiesToken, setRoyaltiesToken] = useState(null)

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
      uploadAndMint(result.hash, contract)
    } catch (e) {
      console.log('error is - ' + e)
    }
  }

  // ----- Upload tokenURI and Mint NFT
  const uploadAndMint = async (hash, contract) => {
    const baseUrl = 'https://ipfs.io/ipfs/'

    // Add timestamp to metadata
    const date = new Date()
    const timestamp = date.getTime()
    const dict = { ...metadata, image: baseUrl + hash, createdAt: timestamp }
    setDict(dict)
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
      const p = ethers.utils.parseEther(price)
      molGamma(contract, p, tokenUri, dict)
    } catch (e) {
      console.log('error is - ' + e, i)
    }
  }

  // ----- Mint NFT
  async function molGamma(contract, ethPrice, tokenURI) {
    const _contract = new ethers.Contract(contract, ABI, signer)
    try {
      const tx = await _contract.mint(sale, ethPrice, tokenURI)
      console.log('tx.hash for minting - ' + tx.hash)

      tx.wait().then((receipt) => {
        if (receipt.confirmations === 1) {
          console.log('mint receipt is - ', receipt)
          history.push('/galleries')
        }
      })
      
      contractListener(_contract)
    } catch (e) {
      console.log(e)
      if (e.code === 4001) {
        alert('MetaMask Tx Signature: User denied transaction signature.')
      }
    }
  }

  // ----- Listen to contract events 
  function contractListener(contract) {
    console.log('listening ')

    contract.on('Transfer', (from, to, tokenId) => {
      console.log('Token minted - ', from, to)
      console.log('NFT tokenId minted - ' + tokenId)

      setId(tokenId.toString())
    })

    contract.on('gRoyaltiesMinted', (contractAddress) => {
      console.log('gRoyalties minted at contract address  - ', contractAddress)

      setRoyaltiesToken(contractAddress)
    })
  }

  // Store metadata on Firestore
  function storeMetadata(dict, id, royaltiesToken) {
    const collectionRef = projectFirestore.collection('nft')
    dict = { ...dict, tokenId: id, gRoyalties: [royaltiesToken] }
    collectionRef.add(dict)

    setImg(null)
    console.log('Success storing metadata to firestore!')

    history.push('/galleries')
  }

  useEffect(() => {
    upload(img, contract)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (url) {
  //     setImg(null)
  //   }
  // }, [img, setImg])

  return (
    <div>
      {/* <div className='progress-bar' style={{ width: progress + '%' }}></div> */}
    </div>
  )
}

export default Mint;