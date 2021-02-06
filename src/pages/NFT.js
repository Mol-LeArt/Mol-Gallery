import React from 'react'
import { useLocation } from 'react-router-dom'
// import { projectFirestore } from '../firebase/config'
// import ABI from '../comps/MOLGAMMA_ABI'
// import { ethers } from 'ethers'

import './NFT.css' 

const NFT = ({ account }) => {
  // ----- Reaect Router Config
  const location = useLocation()
  const title = location.state.title
  const desc = location.state.description
  const img = location.state.image
  const sale = location.state.sale
  const price = location.state.price

  // ----- Smart Contract Interaction Config
  // const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  // const signer = provider.getSigner()

  function handleClick() {
    console.log(account, title, desc, img, sale, price)
  }

  return (
    <div className='nft'>
      <img src={img} alt='' />

      <div>
        <div>Title: {title}</div>
        <div>Description: {desc}</div>
        <div>{sale === "1" ? 'For sale!' : 'Not on sale!'}</div>
        <div>Price: {price} Ξ</div>
        <div>Royalties: Need to get this from collection("gallery")</div>
        <button onClick={handleClick}>Buy</button>
      </div>
    </div>
  )
}

export default NFT
