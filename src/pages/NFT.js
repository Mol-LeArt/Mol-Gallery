import React from 'react'
// import { projectFirestore } from '../firebase/config'
// import ABI from '../comps/MOLGAMMA_ABI'
// import { ethers } from 'ethers'

import './NFT.css' 

const NFT = ({ account }) => {
  const title = ''
  const desc = ''
  const img = ''
  const sale = 0
  const price = 0

  // const price = docs
  //   .filter((nft) => nft.id === match.params.id)
  //   .map((nft) => nft.price)

  // Toggle buy button to collaborate for owner of NFT via contract interaction than via firestore.. more efficient

  // ----- Smart Contract Interaction Configuration
  // const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  // const signer = provider.getSigner()

  // ----- Retrieve Contract Address from Firestore
  // async function checkAccount(account) {
  //   const query = await projectFirestore
  //     .collection('gallery')
  //     .where('account', '==', account)
  //     .get()

  //   query.forEach((doc) => {
  //     console.log('contract to buy from - ', doc.data().contract)
  //     const contract = new ethers.Contract(doc.data().contract, ABI, signer)
  //     // upload(img, contract)

  //     molGamma(contract)
  //   })
  // }

  // ----- Smart Contract Interaction & Upload to Firestore
  // async function molGamma(contract) {
  //   try {
  //     const tx = await contract.mint(metadata.sale, ethPrice, tokenURI)
  //     console.log('this is tx.hash - ' + tx.hash)
  //     await tx.wait()
  //   } catch (e) {
  //     console.log(e)
  //     if (e.code === 4001) {
  //       alert('MetaMask Tx Signature: User denied transaction signature.')
  //     }
  //   }

  //   contract.on('Transfer', (from, to, tokenId) => {
  //     console.log('Token minted - ', from, to)
  //     console.log('nft tokenId - ' + tokenId)
  //   })

  //   contract.on('gRoyaltiesMinted', (contractAddress) => {
  //     console.log('gRoyalties contract address - ', contractAddress)

  //     // Store metadata on Firestore
  //     const collectionRef = projectFirestore.collection('nft')
  //     dict = { ...dict, gRoyalties: [contractAddress] }
  //     collectionRef.add(dict)
  //   })
  // }

  function handleClick() {
    console.log(account)
    // checkAccount(account)
  }

  return (
    <div className='nft'>
      <img src={img} alt='' />

      <div>
        <div>Title: {title}</div>
        <div>Description: {desc}</div>
        <div>{sale === 1 ? 'For sale!' : 'Not on sale!'}</div>
        <div>Price: {price} Ξ</div>
        <div>Royalties: Need to get this from collection("gallery")</div>
        <button onClick={handleClick}>Buy</button>
      </div>
    </div>
  )
}

export default NFT
