import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// import { projectFirestore } from '../firebase/config'
import { ethers, BigNumber } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'


import './NFT.css' 

const NFT = ({ account }) => {
  const [royalties, setRoyalties] = useState(null)
  const [owner, setOwner] = useState(null)

  // ----- Reaect Router Config
  const location = useLocation()
  const contract = location.state.contract
  const tokenId = location.state.tokenId
  const title = location.state.title
  const desc = location.state.description
  const img = location.state.image
  const sale = location.state.sale
  const price = location.state.price

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const _contract = new ethers.Contract(contract, ABI, signer)


  const getRoyalties = async (tokenId) => {
    _contract.getRoyalties(tokenId).then((data) => {
      const number = data[1][0]
      setRoyalties(number.toString())
    }).catch(e => console.log(e))
  }

  const getOwner = async (tokenId) => {
    _contract.ownerOf(tokenId).then((data) => {
      setOwner(data)
    }).catch(e => console.log(e))
  }

  const buyNft = async (tokenId) => {
    const overrides = {
      value: ethers.utils.parseEther(price),
    }

    try {
      console.log('tokenId to buy', tokenId)
      const tx = await _contract.purchase(tokenId, overrides)
      console.log('this is tx.hash for purchase', tx.hash)
  
      const receipt = await tx.wait()
      console.log('mint receipt is - ', receipt)
      contractListener()
    } catch (e) {
      console.log(e)
    }    
  }
  
  // Listen to contract events 
  function contractListener() {
    _contract.on('Transfer', (from, to, tokenId) => {
      console.log('Token transferred - ', from, to)
      console.log('NFT tokenId transferred - ' + tokenId)

      setOwner(to)
    })
  }

  function handleClick() {
    console.log('price for purchase ', price)

    buyNft(tokenId)
  }

  useEffect(() => {
    getRoyalties(tokenId)
    getOwner(tokenId)
  }, [])

  return (
    <div className='nft'>
      <img src={img} alt='' />

      <div>
        <div>Title: {title}</div>
        <div>Description: {desc}</div>
        <div>{sale === "1" ? 'For sale!' : 'Not on sale!'}</div>
        <div>Price: {price} Ξ</div>
        <div>Royalties: {royalties}%</div>
        <div>Owner: {owner} </div>
        <button onClick={handleClick}>Buy</button>
      </div>
    </div>
  )
}

export default NFT
