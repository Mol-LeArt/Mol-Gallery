import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// import { projectFirestore } from '../firebase/config'
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'
import Form from '../comps/Form'

import './NFT.css'

const NFT = ({ account }) => {
  const [royalties, setRoyalties] = useState(null)
  const [owner, setOwner] = useState(null)
  const [sale, setSale] = useState(0)
  const [price, setPrice] = useState(0.0)
  const [match, toggleMatch] = useState(null)
  const [form, toggleForm] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('Buy')

  // ----- Reaect Router Config
  const location = useLocation()
  const contract = location.state.contract
  const tokenId = location.state.tokenId
  const title = location.state.title
  const desc = location.state.description
  const img = location.state.image

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const _contract = new ethers.Contract(contract, ABI, signer)

  const getRoyalties = async (tokenId) => {
    _contract
      .getRoyalties(tokenId)
      .then((data) => {
        const number = data[1][0]
        setRoyalties(number.toString())
      })
      .catch((e) => console.log(e))
  }

  const getOwner = async (tokenId) => {
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        setOwner(data)
      })
      .catch((e) => console.log(e))
  }

  const getSale = async (tokenId) => {
    _contract
      .sale(tokenId)
      .then((data) => {
        setSale(data[0])
        const p = ethers.utils.formatEther(data[1].toString())
        setPrice(p)

        if (data[0] === 0) {
          setButtonTitle('Not for sale!')
        }
      })
      .catch((e) => console.log(e))
  }

  const isOwner = () => {
    if (owner) {
      if (owner.toLowerCase() === account) {
        toggleMatch(true)
      } else {
        console.log('Not owner of NFT')
      }
    }
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
      console.log(e.message)
    }
  }

  // Listen to contract events
  function contractListener() {
    _contract.on('Transfer', (from, to, tokenId) => {
      console.log('Token transferred - ', from, to)
      console.log('NFT tokenId transferred - ' + tokenId)
      to = to.toLowerCase()
      setOwner(to)

      window.location.reload()
    })

    _contract.on('gRoyaltiesMinted', (contractAddress) => {
      console.log('gRoyalties minted at contract address  - ', contractAddress)

      // UPDATE ABI AND BYTECODE FIRST
      // setRoyaltiesToken(contractAddress)
    })
  }

  function handleBuy() {
    buyNft(tokenId)
  }

  function handleOnSale() {
    toggleForm(true)
  }

  useEffect(() => {
    getRoyalties(tokenId)
    getOwner(tokenId)
    getSale(tokenId)
    isOwner()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner])

  return (
    <div className='nft'>
      <img src={img} alt='' />

      <div>
        <div>Title: {title}</div>
        <div>Description: {desc}</div>
        <div>Price: {price} Ξ</div>
        <div>Royalties: {royalties}%</div>
        <div>Owner: {owner} </div>
        <button onClick={handleBuy} disabled={sale === 0 || match}>
          {buttonTitle}
        </button>
        {form && (
          <Form
            toggleForm={toggleForm}
            contract={_contract}
            tokenId={tokenId}
          ></Form>
        )}
        {match && <button onClick={handleOnSale}>Update sale status</button>}
      </div>
    </div>
  )
}

export default NFT
