import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// import { projectFirestore } from '../firebase/config'
import { ethers } from 'ethers'
import MOLGAMMA_ABI from '../comps/MOLGAMMA_ABI'
import MOLVAULT_ABI from '../comps/MOLVAULT_ABI'
import GAMMA_ABI from '../comps/GAMMA_ABI'
import Form from '../comps/Form'

import './NFT.css'

const NFT = ({ account }) => {
  const [royalties, setRoyalties] = useState(null)
  const [owner, setOwner] = useState(null)
  const [artist, setArtist] = useState(null)
  const [sale, setSale] = useState(0)
  const [price, setPrice] = useState(0.0)
  const [match, toggleMatch] = useState(null)
  const [form, toggleForm] = useState(false)
  const [buttonTitle, setButtonTitle] = useState('Buy (Ξ)')
  const [vaultGammaAddress, setVaultGammaAddress] = useState(null)
  const [contractToUpdateSale, setContractToUpdateSale] = useState(null)

  // ----- Reaect Router Config
  const location = useLocation()
  const origin = location.state.origin
  const contract = location.state.contract
  const tokenId = location.state.tokenId
  const title = location.state.title
  const desc = location.state.description
  const img = location.state.image
  const gamma = location.state.gamma

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  // const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)

  // ----- MolGamma Functions
  const getRoyalties = async (tokenId) => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
    _contract
      .getRoyalties(tokenId)
      .then((data) => {
        const number = data[1][0]
        setRoyalties(number.toString())
      })
      .catch((e) => console.log(e))
  }

  const getArtist = async () => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
    _contract
      .creator()
      .then((data) => {
        setArtist(data)
      })
      .catch((e) => console.log(e))
  }

  const getMolGammaOwner = async (tokenId) => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        setOwner(data)
        isOwner(data)
      })
      .catch((e) => console.log(e))
  }

  const getMolGammaSale = async (tokenId) => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
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

  const isOwner = (address) => {
    console.log(address)
    if (address) {
      if (address.toLowerCase() === account) {
        toggleMatch(true)
      } else {
        console.log('Not owner of NFT')
      }
    }
  }

  const buyNft = async (tokenId) => {
    if (origin !== 'vault') {
      const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
      const overrides = {
        value: ethers.utils.parseEther(price),
      }

      try {
        const tx = await _contract.purchase(tokenId, overrides)
        console.log('this is tx.hash for purchase', tx.hash)

        const receipt = await tx.wait()
        console.log('mint receipt is - ', receipt)
        window.location.reload()
        contractListener(_contract)
      } catch (e) {
        console.log(e.message)
      }
    } else {
      const ethPrice = ethers.utils.parseEther(price)
      const p = parseInt(ethPrice, 10)
      const priceWithFee = p + p * 0.003

      console.log('Buyer pays a total of - ', priceWithFee)
      const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
      const overrides = {
        value: priceWithFee.toString(),
      }

      try {
        const tx = await _contract.purchase(vaultGammaAddress, tokenId, overrides)
        console.log('this is tx.hash for purchase', tx.hash)

        const receipt = await tx.wait()
        console.log('mint receipt is - ', receipt)
        window.location.reload()
        contractListener(_contract)
      } catch (e) {
        console.log(e.message)
      }
    }    
  }

  // ----- MolVault Functions
  const getTokenKey = async () => {
    const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
    _contract.gamma().then((gAddress) => {
      setVaultGammaAddress(gAddress)
      getGammaOwner(gAddress, tokenId)

      _contract
        .getTokenKey(gAddress, tokenId)
        .then((tokenKey) => {
          getVaultSale(tokenKey)
        })
        .catch((e) => console.log(e))
    }).catch(e => console.log(e))
  }

  const getVaultSale = async (tokenKey) => {
    const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
    _contract
      .sale(tokenKey)
      .then((data) => {
        // toggle update sale status button 
        isOwner(data[0])

        setArtist(data[0])
        setSale(data[1])
        const p = ethers.utils.formatEther(data[2].toString())
        setPrice(p)
        if (data[1] === 0) {
          setButtonTitle('Not for sale!')
        }
      })
      .catch((e) => console.log(e))
  }

  const getGammaOwner = async (tokenAddress, tokenId) => {
    const _contract = new ethers.Contract(tokenAddress, GAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        setOwner(data)
      })
      .catch((e) => console.log(e))
  }

  // ----- Contract Listener
  function contractListener(contract) {
    contract.on('Transfer', (from, to, tokenId) => {
      console.log('Token transferred - ', from, to)
      console.log('NFT tokenId transferred - ' + tokenId)
      to = to.toLowerCase()
      setOwner(to)

      window.location.reload()
    })

    contract.on('gRoyaltiesMinted', (contractAddress) => {
      console.log('gRoyalties minted at contract address  - ', contractAddress)

      // UPDATE ABI AND BYTECODE FIRST
      // setRoyaltiesToken(contractAddress)
    })
  }

  function handleBuy() {
    buyNft(tokenId)
  }

  function updateSale() {
    toggleForm(true)

    if (origin !== 'vault') {
      const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
      setContractToUpdateSale(_contract)
    } else {
      const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
      setContractToUpdateSale(_contract)
    }
  }

  useEffect(() => {
    isOwner(owner)

    if (origin !== 'vault') {
      getRoyalties(tokenId)
      getMolGammaOwner(tokenId)
      getMolGammaSale(tokenId)
      getArtist()
    } else {
      getTokenKey()
    }

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
        <div>Artist: {artist}</div>
        <div>Owner: {owner}</div>
        <button onClick={handleBuy} disabled={sale === 0 || match}>
          {buttonTitle}
        </button>
        {form && (
          <Form
            toggleForm={toggleForm}
            contract={contractToUpdateSale}
            tokenId={tokenId}
            gamma={gamma}
          ></Form>
        )}
        {match && <button onClick={updateSale}>Update sale status</button>}
      </div>
    </div>
  )
}

export default NFT
