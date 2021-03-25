import React, { useState, useEffect, useContext } from 'react'
import MOLGAMMA_ABI from './MOLGAMMA_ABI'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import GAMMA_ABI from '../comps/GAMMA_ABI'
import { ethers } from 'ethers'
import { CommunityContext, GlobalContext } from '../GlobalContext'

const NFT_Detail = ({
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
}) => {
  // ----- useState
  const [royalties, setRoyalties] = useState(null)

  // ----- useContext
  const { account } = useContext(GlobalContext)
  const { commons, gamma, coin } = useContext(CommunityContext)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- MolCommons Functions
  const getTokenKey = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    _contract
      .getTokenKey(gamma, tokenId)
      .then((tokenKey) => {
        getGammaSaleData(tokenKey)
      })
      .catch((e) => console.log(e))
  }

  const getGammaSaleData = async (tokenKey) => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    _contract
      .sale(tokenKey)
      .then((data) => {
        // Creator
        setCreator(data[0])

        // Sale Price in ETH
        if (owner === 'Commons') {
          // Sale Status
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

  // ----- Gamma Functions (for when Gamma is out of MolVault)
  const getGammaPriceAndSale = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .sale(tokenId)
      .then((data) => {
        const p = ethers.utils.formatEther(data[0])
        setPrice(p)
        setIsSale(data[1])
      })
      .catch((e) => console.log(e))
  }

  const getGammaOwner = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        if (data === commons) {
          setOwner('Commons')
        } else {
          setOwner(data)
        }
      })
      .catch((e) => console.log(e))
  }

  const getGammaRoyalties = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .royalties()
      .then((data) => {
        const r = ethers.utils.formatUnits(data, 'wei')
        setRoyalties(Math.trunc(r))
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    getTokenKey()
    getGammaOwner()
    getGammaRoyalties()

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
