import React, { useState, useEffect } from 'react'
import MOLGAMMA_ABI from './MOLGAMMA_ABI'
import MOLVAULT_ABI from './MOLVAULT_ABI'
import GAMMA_ABI from '../comps/GAMMA_ABI'
import { ethers } from 'ethers'

const NFT_Detail = ({
  origin,
  contract,
  title,
  desc,
  price,
  setPrice,
  coins,
  setCoins,
  tokenId,
  creator,
  setCreator,
  owner,
  setOwner,
  setIsSale,
  setGammaAddress,
}) => {
  const [royalties, setRoyalties] = useState(null)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

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

  const getCreator = async () => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
    _contract
      .creator()
      .then((data) => {
        setCreator(data)
      })
      .catch((e) => console.log(e))
  }

  const getMolGammaOwner = async (tokenId) => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        setOwner(data)
      })
      .catch((e) => console.log(e))
  }

  const getMolGammaSale = async (tokenId) => {
    const _contract = new ethers.Contract(contract, MOLGAMMA_ABI, signer)
    _contract
      .sale(tokenId)
      .then((data) => {
        setIsSale(data[0])
        const p = ethers.utils.formatEther(data[1].toString())
        setPrice(p)
      })
      .catch((e) => console.log(e))
  }

  // ----- MolVault Functions
  const getTokenKey = async () => {
    const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
    _contract
      .gamma()
      .then((gAddress) => {
        setGammaAddress(gAddress)
        getGammaOwner(gAddress, tokenId)
        getGammaRoyalties(gAddress)

        _contract
          .getTokenKey(gAddress, tokenId)
          .then((tokenKey) => {
            getGammaSaleData(tokenKey)
          })
          .catch((e) => console.log(e))
      })
      .catch((e) => console.log(e))
  }

  const getGammaSaleData = async (tokenKey) => {
    const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
    _contract
      .sale(tokenKey)
      .then((data) => {
        // Creator
        setCreator(data[0])

        // Sale Status
        // setIsSale(data[1])

        // Sale Price in ETH
        if (owner === 'Commons') {
          setIsSale(data[1])
          const p = ethers.utils.formatEther(data[2].toString())
          setPrice(p)
        } else {
          getGammaPriceAndSale()
        }

        // Sale Price in Coins
        const t = ethers.utils.formatEther(data[3].toString())
        setCoins(Math.trunc(t))
      })
      .catch((e) => console.log(e))
  }

  const getGammaOwner = async (tokenAddress, tokenId) => {
    const _contract = new ethers.Contract(tokenAddress, GAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        if (data === contract) {
          setOwner('Commons')
        } else {
          setOwner(data)
        }
      })
      .catch((e) => console.log(e))
  }

  const getGammaRoyalties = async (tokenAddress) => {
    const _contract = new ethers.Contract(tokenAddress, GAMMA_ABI, signer)
    _contract
      .royalties()
      .then((data) => {
        const r = ethers.utils.formatUnits(data, 'wei')
        setRoyalties(Math.trunc(r))
      })
      .catch((e) => console.log(e))
  }

  // ----- Gamma Functions (for when Gamma is out of MolVault)
  const getGammaPriceAndSale = async () => {
    const _contract = new ethers.Contract(contract, MOLVAULT_ABI, signer)
    _contract
      .gamma()
      .then((gAddress) => {
        const _contract = new ethers.Contract(gAddress, GAMMA_ABI, signer)
        _contract.sale(tokenId).then((data) => {
            const p = ethers.utils.formatEther(data[0])
            setPrice(p)
            setIsSale(data[1])
          })
          .catch((e) => console.log(e))
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    if (origin === 'vault') {
      getTokenKey()
    } else if (origin === 'personal') {
      getRoyalties(tokenId)
      getMolGammaOwner(tokenId)
      getMolGammaSale(tokenId)
      getCreator()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, price])

  return (
    <div class='space-y-4'>
      <div class='text-gray-400'>
        Title: <span class='text-gray-800'>{title}</span>
      </div>
      <div class='text-gray-400'>
        Description: <span class='text-gray-800'>{desc}</span>
      </div>
      <div class='text-gray-400'>
        Price: <span class='text-gray-800'>{price} Ξ</span>
      </div>
      {owner === 'Commons' && (
        <div class='text-gray-400'>
          Coins: <span class='text-gray-800'>{coins} 🎨</span>
        </div>
      )}
      <div class='text-gray-400'>
        Royalties: <span class='text-gray-800'>{royalties} %</span>
      </div>
      <div class='text-gray-400'>
        Artist: <span class='text-gray-800'>{creator}</span>
      </div>
      <div class='text-gray-400'>
        Owner: <span class='text-gray-800'>{owner}</span>
      </div>
    </div>
  )
}

export default NFT_Detail
