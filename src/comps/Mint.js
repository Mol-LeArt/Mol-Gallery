import React, { useEffect } from 'react';
import fleek from '@fleekhq/fleek-storage-js'
import ABI from './MOLGAMMA_ABI'
import { ethers } from 'ethers'
import { projectFirestore } from '../firebase/config'
import './Mint.css'

const Mint = ({ metadata, img, account }) => {
  // ----- Smart Contract Interaction Configuration
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- Retrieve Contract Address from Firestore
  async function checkAccount(account) {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    query.forEach((doc) => {
      console.log('contract to mint from - ', doc.data().contract)
      const contract = new ethers.Contract(doc.data().contract, ABI, signer)
      upload(img, contract)
    })
  }

  // ----- Upload image to Fleek Storage
  const upload = async (data, contract) => {
    const input = {
      apiKey: 'Vs8ZbWOrhEbCxXtPwkllwg==',
      apiSecret: 'f9RwSgTy/2ccYEKTdImm+E6crqkuyeAIZ8mpBzCmYiI=',
      bucket: 'audsssy-team-bucket',
      key: metadata.title,
      data,
    }

    try {
      const result = await fleek.upload(input)
      console.log('this is image hash from fleek - ' + result.hash)

      // Mint NFT
      mint(result.hash, contract)
    } catch (e) {
      console.log('error is - ' + e)
    }
  }

  // ----- Mint NFT
  const mint = async (hash, contract) => {
    const baseUrl = 'https://ipfs.io/ipfs/'

    // Add timestamp to metadata
    const date = new Date()
    const timestamp = date.getTime()
    // const createdAt = timeStamp()
    const dict = { ...metadata, image: baseUrl + hash, createdAt: timestamp }
    const data = JSON.stringify(dict)
    console.log('tokenURI is - ', dict)

    const i = {
      apiKey: 'Vs8ZbWOrhEbCxXtPwkllwg==',
      apiSecret: 'f9RwSgTy/2ccYEKTdImm+E6crqkuyeAIZ8mpBzCmYiI=',
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
      const price = ethers.utils.parseEther(metadata.price)
      molGamma(contract, price, tokenUri, dict)
    } catch (e) {
      console.log('error is - ' + e, i)
    }
  }

  // ----- Smart Contract Interaction & Upload to Firestore
  async function molGamma(contract, ethPrice, tokenURI, dict) {
    try {
      const tx = await contract.mint(metadata.sale, ethPrice, tokenURI)
      console.log('this is tx.hash - ' + tx.hash)
      await tx.wait()

      contract.on('Transfer', (from, to, tokenId) => {
        console.log('Token minted - ', from, to)
        console.log('nft tokenId - ' + tokenId)
        dict = { ...dict, tokenId: tokenId }
      })

      contract.on('gRoyaltiesMinted', (contractAddress) => {
        console.log('gRoyalties contract address - ', contractAddress)

        // Store metadata on Firestore
        const collectionRef = projectFirestore.collection('nft')
        dict = { ...dict, gRoyalties: [contractAddress] }
        collectionRef.add(dict)
      })
    } catch (e) {
      console.log(e)
      if (e.code === 4001) {
        alert('MetaMask Tx Signature: User denied transaction signature.')
      }
    }
  }

  useEffect(() => {
    checkAccount(account)
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