import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../comps/MOLCOMMONS_ABI'
import MOLGAMMA_ABI from '../comps/MOLGAMMA_ABI'
import Form from '../comps/Form'
import NFT_Detail from '../comps/NFT_Detail'
import { GlobalContext, CommunityContext } from '../GlobalContext'

const NFT = () => {
  const [owner, setOwner] = useState(null)
  const [creator, setCreator] = useState(null)
  const [split, setSplit] = useState(null)
  const [collaborators, setCollaborators] = useState(null)
  const [ownerMatch, setOwnerMatch] = useState(null)
  const [creatorMatch, setCreatorMatch] = useState(null)

  const [isSale, setIsSale] = useState(0)
  const [ethPrice, setEthPrice] = useState(0.0)
  const [coinPrice, setCoinPrice] = useState(0.0)

  const [form, setForm] = useState(false)
  const [fee, setFee] = useState(null)
  const [buyError, setBuyError] = useState(null)

  const [isMinter, setIsMinter] = useState(null)

  const { account } = useContext(GlobalContext)
  const { commons, gamma } = useContext(CommunityContext)

  // ----- Reaect Router Config
  const history = useHistory()
  const location = useLocation()
  const tokenId = location.state.tokenId
  const title = location.state.title
  const desc = location.state.description
  const img = location.state.image

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  const isOwner = () => {
    if (owner) {
      if (owner.toLowerCase() === account) {
        setOwnerMatch(true)
      } else {
        console.log('Not owner of NFT')
      }
    }
  }

  const isCreator = () => {
    if (creator) {
      if (creator.toLowerCase() === account) {
        setCreatorMatch(true)
      } else {
        console.log('Not creator of NFT')
      }
    }
  }

  const getFee = async () => {
    const _contract = new ethers.Contract(gamma, MOLGAMMA_ABI, signer)
    try {
      _contract.fee().then((data) => {
        const _fee = Math.trunc(ethers.utils.formatUnits(data, 'wei'))
        setFee(_fee)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const checkMinterStatus = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      _contract.isMinter(account).then((data) => {
        console.log('is minter? ', data)
        setIsMinter(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const buyWithEth = async () => {
    setBuyError('')
    // Set price
    const price = ethers.utils.parseEther(ethPrice)

    // Config contract
    const _contract = new ethers.Contract(gamma, MOLGAMMA_ABI, signer)
    const overrides = {
      value: price.toString(),
    }

    // Contract interaction
    try {
      const tx = await _contract.purchase(tokenId, overrides)
      console.log('this is tx.hash for purchase', tx.hash)

      const receipt = await tx.wait()
      console.log('mint receipt is - ', receipt)
      window.location.reload()
    } catch (e) {
      console.log(e.message)
    }
  }

  // ----- Buy NFT with Commons coins
  const buyWithCoins = async () => {
    setBuyError('')

    const c = ethers.utils.parseEther(coinPrice.toString())
    console.log('Buyer pays a total of - ', c)
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)

    try {
      const tx = await _contract.coinPurchase(tokenId)
      console.log('this is tx.hash for purchase', tx.hash)

      const receipt = await tx.wait()
      console.log('mint receipt is - ', receipt)
      window.location.reload()
      // contractListener(_contract)
    } catch (e) {
      console.log(e)
      const err = Math.abs(e.error.code)
      const message = e.error.message

      if (err === 32603 && message === 'execution reverted: !price') {
        setBuyError('Insufficient coins!')
      }
    }
  }

  function updateSale() {
    setForm(true)
  }

  useEffect(() => {
    isOwner()
    isCreator()
    getFee()
    checkMinterStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, creator, isSale, fee])

  return (
    <div class='font-mono flex items-center my-16 max-w-4xl mx-auto'>
      <img class='flex-1 max-w-sm' src={img} alt='' />

      <div class='flex-1 max-w-md mx-auto flex-col justify-center space-y-4'>
        <NFT_Detail
          title={title}
          desc={desc}
          price={ethPrice}
          setPrice={setEthPrice}
          coins={coinPrice}
          setCoins={setCoinPrice}
          tokenId={tokenId}
          creator={creator}
          setCreator={setCreator}
          owner={owner}
          setOwner={setOwner}
          setIsSale={setIsSale}
          fee={fee}
          split={split}
          setSplit={setSplit}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
        />
        <div class='flex space-x-4 mx-4'>
          <button
            class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md disabled:opacity-50'
            onClick={buyWithEth}
            // disabled={isSale === 0 || ownerMatch || creatorMatch}
          >
            Buy (Ξ)
          </button>
          {owner === 'Commons' && (
            <button
              class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md disabled:opacity-50'
              onClick={buyWithCoins}
              disabled={isSale === 0 || ownerMatch || creatorMatch}
            >
              Buy (Coins)
            </button>
          )}
          {(ownerMatch || (owner === 'Commons' && creatorMatch)) && (
            <button
              class='flex-1 py-2 px-4 text-white bg-yellow-600 hover:bg-yellow-500 w-max rounded-md'
              onClick={updateSale}
            >
              Update Sale
            </button>
          )}

          {isMinter && (
            <Link
              to={{
                pathname: `/community/mint`,
                state: { creator: creator },
              }}
              style={{ textDecoration: 'none' }}
            >
              <button class='flex-1 py-2 px-4 text-white bg-indigo-800 hover:bg-yellow-500 w-max rounded-md'>
                Remix
              </button>
            </Link>
          )}
        </div>
        {buyError && (
          <div class='text-red-400 text-sm text-center'>{buyError}</div>
        )}
        {form && <Form setForm={setForm} tokenId={tokenId}></Form>}
      </div>
    </div>
  )
}

export default NFT
