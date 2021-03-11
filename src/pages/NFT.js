import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLGAMMA_ABI from '../comps/MOLGAMMA_ABI'
import MOLVAULT_ABI from '../comps/MOLVAULT_ABI'
import Form from '../comps/Form'
import NFT_Detail from '../comps/NFT_Detail'

const NFT = ({ account }) => {
  const [owner, setOwner] = useState(null)
  const [creator, setCreator] = useState(null)
  const [isSale, setIsSale] = useState(0)
  const [price, setPrice] = useState(0.0)
  const [coins, setCoins] = useState(0.0)
  const [match, toggleMatch] = useState(null)
  const [form, toggleForm] = useState(false)
  const [gammaAddress, setGammaAddress] = useState(null)
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

  const isOwner = () => {
    if (owner && creator) {
      if (owner.toLowerCase() === account || creator.toLowerCase() === account) {
        toggleMatch(true)
      } else {
        console.log('Not owner of NFT')
      }
    }
  }

  const buyWithEth = async (tokenId) => {
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
        // contractListener(_contract)
      } catch (e) {
        console.log(e.message)
      }
    } else {
      const ethPrice = ethers.utils.parseEther(price)
      const p = parseInt(ethPrice, 10)
      const priceWithFee = p + p * 0.003 // get x and y for distribution

      console.log('Buyer pays a total of - ', priceWithFee)
      const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
      const overrides = {
        value: priceWithFee.toString(),
      }

      try {
        const tx = await _contract.purchase(gammaAddress, tokenId, overrides)
        console.log('this is tx.hash for purchase', tx.hash)

        const receipt = await tx.wait()
        console.log('mint receipt is - ', receipt)
        window.location.reload()
        // contractListener(_contract)
      } catch (e) {
        console.log(e.message)
      }
    }
  }

  const buyWithCoins = async (tokenId) => {
    const c = ethers.utils.parseEther(coins)
    console.log('Buyer pays a total of - ', c)
    const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)

    try {
      const tx = await _contract.tokenPurchase(gammaAddress, tokenId)
      console.log('this is tx.hash for purchase', tx.hash)

      const receipt = await tx.wait()
      console.log('mint receipt is - ', receipt)
      window.location.reload()
      // contractListener(_contract)
    } catch (e) {
      console.log(e.message)
    }
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
    isOwner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, isSale])

  return (
    <div class='font-mono flex items-center my-16 max-w-4xl mx-auto'>
      <img class='flex-1 max-w-sm' src={img} alt='' />

      <div class='flex-1 max-w-md mx-auto flex-col justify-center space-y-4'>
        <NFT_Detail
          origin={origin}
          contract={contract}
          title={title}
          desc={desc}
          price={price}
          setPrice={setPrice}
          coins={coins}
          setCoins={setCoins}
          tokenId={tokenId}
          creator={creator}
          setCreator={setCreator}
          owner={owner}
          setOwner={setOwner}
          setIsSale={setIsSale}
          setGammaAddress={setGammaAddress}
        />
        <div class='flex space-x-4 mx-4'>
          <button
            class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md disabled:opacity-50'
            onClick={buyWithEth}
            disabled={isSale === 0 || match}
          >
            Buy (Ξ)
          </button>
          <button
            class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md disabled:opacity-50'
            onClick={buyWithCoins}
            disabled={isSale === 0 || match}
          >
            Buy (Coins)
          </button>
          {match && (
            <button
              class='flex-1 py-2 px-4 text-white bg-yellow-600 hover:bg-yellow-500 w-max rounded-md'
              onClick={updateSale}
            >
              Update Sale
            </button>
          )}
        </div>

        {form && (
          <Form
            toggleForm={toggleForm}
            contract={contractToUpdateSale}
            tokenId={tokenId}
            gamma={gamma}
          ></Form>
        )}
      </div>
    </div>
  )
}

export default NFT
