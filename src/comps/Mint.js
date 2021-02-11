import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import fleek from '@fleekhq/fleek-storage-js'
import ABI from './MOLGAMMA_ABI'
import { ethers } from 'ethers'
import { projectFirestore } from '../firebase/config'
import './Mint.css'

const Mint = ({ metadata, img, setImg, account }) => {
  const [dict, setDict] = useState({})
  const [id, setId] = useState(null)
  const [royaltiesToken, setRoyaltiesToken] = useState(null)

  // ----- Reaect Router Config
  const history = useHistory()

  // ----- Smart Contract Interaction Config
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
    setDict(dict)
    console.log('tokenURI is - ', dict)

    const data = JSON.stringify(dict)
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

  // ----- Smart Contract Interaction
  async function molGamma(contract, ethPrice, tokenURI) {
    try {
      const tx = await contract.mint(metadata.sale, ethPrice, tokenURI)
      console.log('this is tx.hash - ' + tx.hash)

      const receipt = await tx.wait()
      console.log('mint receipt is - ', receipt)
      contractListener(contract)
    } catch (e) {
      console.log(e)
      if (e.code === 4001) {
        alert('MetaMask Tx Signature: User denied transaction signature.')
      }
    }
  }

  // Listen to contract events 
  function contractListener(contract) {
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

    history.push('/gallery')
  }

  useEffect(() => {
    // if (id === '' && royaltiesToken === '') {
    //   checkAccount(account)
    // } else {
    //   storeMetadata(dict, id, royaltiesToken)
    // }

    if (!id && !royaltiesToken) {
      checkAccount(account)
    } else if (id && royaltiesToken) {
      storeMetadata(dict, id, royaltiesToken)
    } else {
      console.log("Cracks in useEffect of Mint.js")
    }

    console.log('id in useEffect - ', id)
    console.log('gRoyalties in useEffect - ', royaltiesToken)
    console.log('dict in useEffect - ', dict)
    // console.log('contractEvent in useEffect - ', contractEvent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, royaltiesToken])

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