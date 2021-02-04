import React, { useEffect } from 'react';
import fleek from '@fleekhq/fleek-storage-js'
import ABI from './MOLGAMMA_ABI'
import { ethers } from 'ethers'
import { projectFirestore, timeStamp } from '../firebase/config'
import './Mint.css'

const Mint = ({ metadata, img, account }) => {
  // ----- Smart Contract Interaction Configuration
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  // const address = '0xe05AD5059dB36C23f08004Dfb535e36b8359DF3E'
  // const molGammaContract = new ethers.Contract(address, ABI, signer)
  const num = 1000000000000000000
  const num2 = num.toString()

  // ----- Retrieve Contract Address from Firestore
  async function checkAccount(account) {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    query.forEach((doc) => {
      console.log("contract to mint from - ", doc.data().contract)
      const contract = new ethers.Contract(
        doc.data().contract,
        ABI,
        signer
      )
      upload(img, contract)
    })
  }

  // ----- Smart Contract Interaction
  async function molGamma(contract, ethPrice, tokenURI) {
    try {
      const tx = await contract.mint(1, ethPrice, tokenURI)
      console.log('this is tx.hash - ' + tx.hash)
      await tx.wait()
    } catch (e) {
      console.log(e)
      if (e.code === 4001) {
        alert('MetaMask Tx Signature: User denied transaction signature.')
      }
    }
  
    contract.on('Transfer', (from, to, tokenId) => {
      console.log("Token minted - ", from, to)
      console.log('nft tokenId - ' + tokenId)
    })

    contract.on('gRoyaltiesMinted', (contractAddress) => {
      console.log("gRoyalties contract address - ", contractAddress)
    })
  }

  // ----- Mint NFT
  const mint = async (hash, contract) => {
    const baseUrl = 'https://ipfs.io/ipfs/'
    
    // Add timestamp to metadata
    // const date = new Date()
    // const timestamp = date.getTime()
    const createdAt = timeStamp()
    const dict = { ...metadata, image: baseUrl + hash, createdAt: createdAt }
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
      molGamma(contract, num2, tokenUri)

      // Store metadata on Firestore
      const collectionRef = projectFirestore.collection('nft')
      collectionRef.add(dict)
    } catch (e) {
      console.log('error is - ' + e, i)
    }
  }

  // ----- Upload image to Fleek Storage
  const upload = async (data, contract) => {
    const input = {
      apiKey: 'Vs8ZbWOrhEbCxXtPwkllwg==',
      apiSecret: 'f9RwSgTy/2ccYEKTdImm+E6crqkuyeAIZ8mpBzCmYiI=',
      bucket: 'audsssy-team-bucket',
      key: metadata.name,
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