import React, { useState, useEffect, useContext } from 'react'
import MOLGAMMA_ABI from './MOLGAMMA_ABI'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
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
  fee,
  split, 
  setSplit,
  collaborators,
  setCollaborators,
}) => {
  // ----- useState
  const [royalties, setRoyalties] = useState(null)

  // ----- useContext
  const { commons, gamma } = useContext(CommunityContext)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- MolCommons Functions
  const getNFT = async () => {
    const _collaborators = []
    const _contract = new ethers.Contract(gamma, MOLGAMMA_ABI, signer)
    _contract
      .getSale(tokenId)
      .then((data) => {
        // GAMMA function - sale[tokenId].ethPrice
        const p = ethers.utils.formatEther(data[0])
        setPrice(p)

        // GAMMA function - sale[tokenId].forSale
        const forSale = Math.trunc(ethers.utils.formatUnits(data[1], 'wei'))
        setIsSale(forSale)

        // GAMMA function - sale[tokenId].minter
        setCreator(data[2])
        // console.log('minter is -', data[2])

        // GAMMA function - sale[tokenId].split
        const s = Math.trunc(ethers.utils.formatUnits(data[3], 'wei'))
        setSplit(s)
        // console.log('split is', data[3])

        // GAMMA function - sale[tokenId].collaborators
        // GAMMA function - sale[tokenId].collaboratorsWeight
        for (var i = 0; i < data[4].length; i++) {
          const collab = {
            address: data[4][i],
            weight: data[5][i],
          }
          _collaborators.push(collab)
          _collaborators.sort((a, b) => b.weight - a.weight)
          setCollaborators([..._collaborators])
        }

        // GAMMA function - sale[tokenId].didPrimary
        const didPrimary = Math.trunc(ethers.utils.formatUnits(data[6], 'wei'))
        // console.log('primary sale?', didPrimary)
      })
      .catch((e) => console.log(e))
  }

  const getGammaOwner = async () => {
    const _contract = new ethers.Contract(gamma, MOLGAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId)
      .then((data) => {
        setOwner(data)
      })
      .catch((e) => console.log(e))
  }

  const getGammaRoyalties = async () => {
    const _contract = new ethers.Contract(gamma, MOLGAMMA_ABI, signer)
    _contract
      .royalties()
      .then((data) => {
        const r = ethers.utils.formatUnits(data, 'wei')
        setRoyalties(Math.trunc(r))
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    getGammaOwner()
    getGammaRoyalties()
    getNFT()
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
      <div class='text-gray-400'>
        Coins: <span class='text-gray-800'>{coins} 🎨</span>
      </div>
      <div class='text-gray-400'>
        Royalties: <span class='text-gray-800'>{royalties} %</span>
      </div>
      <div class='text-gray-400'>
        Tx Fee: <span class='text-gray-800'>{fee} %</span>
      </div>
      <div class='text-gray-400'>
        Collab Split: <span class='text-gray-800'>{split} %</span>
      </div>
      <div class='text-gray-400'>
        Collaborators:{' '}
        <span class='text-gray-800'>
          {collaborators &&
            collaborators.map((collaborator, index) => (
              <div key={index} class='flex items-center mx-auto'>
                <div class='flex-1'>
                  ({index+1}) {collaborator.address}
                </div>
                <div class='flex-2'> {collaborator.weight}%</div>
              </div>
            ))}
        </span>
      </div>
      <div class='text-center mx-auto'>-------------------------------</div>
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
