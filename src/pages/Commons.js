import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BidVault from '../comps/BidVault'
import ImageGrid from '../comps/ImageGrid';
import { ethers } from 'ethers'
// import MOLGAMMA_ABI from '../comps/MOLGAMMA_ABI'
import MOLVAULT_ABI from '../comps/MOLVAULT_ABI'
import GAMMA_ABI from '../comps/GAMMA_ABI'

const Commons = () => {
  const [gamma, setGamma] = useState('')
  const [gammaUris, setGammaUris] = useState([])
  // const [depositTokenUris, setDepositTokenUris] = useState([])
  const [isArtist, toggleIsArtist] = useState(false)
  const [isVaultOwner, toggleIsVaultOwner] = useState(false)
  const [isBidForm, setIsBidForm] = useState(false)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  // const vault = '0x85c72bAd2B9Bc6bECF6BF81b7efccA04cC137426'

  // ----- Reaect Router Config
  const location = useLocation()
  const vault = location.state.vault

  // ----- Get Gamma tokens
  const getGamma = async () => {
    const _contract = new ethers.Contract(vault, MOLVAULT_ABI, signer)
    try {
      _contract.gamma().then((gAddress) => {
        setGamma(gAddress)
        getGammaUri(gAddress)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getGammaUri = async (gAddress) => {
    const uris = []
    const _contract = new ethers.Contract(gAddress, GAMMA_ABI, signer)
    try {
      _contract.totalSupply().then((num) => {
        for (var i = 1; i <= num.toNumber(); i++) {
          _contract.tokenURI(i).then((uri) => {
            uris.push(uri)
            setGammaUris([...uris])
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Get deposited tokens
  // const getDepositTokens = async () => {
  //   const _contract = new ethers.Contract(vault, MOLVAULT_ABI, signer)
  //   try {
  //     _contract.getDepositTokens().then((data) => {
  //       for (var i = 0; i < data.length; i++) {
  //         const tokenAddress = data[i].slice(0, 42)
  //         const tokenId = parseInt(data[i].slice(-10), 16)
  //         getDepositTokenUri(tokenAddress, tokenId)
  //       }
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // const getDepositTokenUri = async (tokenAddress, tokenId) => {
  //   const baseUrl = 'https://rinkeby-api.opensea.io/api/v1/'
  //   try {
  //     fetch(`${baseUrl}/${tokenAddress}/${tokenId}`)
  //      .then((res) => res.json())
  //      .then((data) => {
  //        console.log(data)
  //        setDepositTokenUris(data)
  //      })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // ----- Check owner status to toggle Vault button
  const isOwner = async () => {
    const _contract = new ethers.Contract(vault, MOLVAULT_ABI, signer)
    try {
      signer.getAddress().then((address) => {
        _contract.isOwner(address).then((data) => {
          toggleIsVaultOwner(data)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Check whitelist status to toggle Mint button
  const isWhitelisted = async () => {
    const _contract = new ethers.Contract(vault, MOLVAULT_ABI, signer)

    try {
      signer.getAddress().then((address) => {
        _contract.isWhitelisted(address).then((data) => {
          toggleIsArtist(data)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  const toggleBidForm = () => {
    setIsBidForm(true)
  } 

  useEffect(() => {
    if (vault) {
      isOwner()
      isWhitelisted()
      getGamma()
      // getDepositTokens()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='mx-auto px-4 my-10 max-w-6xl space-y-6 font-primary flex-col justify-center'>
      <div class='text-7xl font-bold text-center'>Commons</div>
      <div class='flex justify-center'>
        <p>
          Admin - access limited to community organizers <br />
          Mint - access limited to whitelisted members <br />
          Bid - public access
        </p>
      </div>

      <div class='flex justify-center space-x-4'>
        <div>
          <Link
            to={{
              pathname: '/manage',
              state: { vault: vault },
            }}
          >
            {isVaultOwner && (
              <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'>
                Admin
              </button>
            )}
          </Link>
        </div>

        <div>
          <Link
            to={{
              pathname: '/mint',
              state: { commons: 'commons', contract: vault },
            }}
          >
            {isArtist && (
              <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'>
                Mint
              </button>
            )}
          </Link>
        </div>
        <div>
          <button
            class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'
            onClick={toggleBidForm}
          >
            Bid
          </button>
        </div>
      </div>

      {isBidForm && <BidVault vault={vault} setIsBidForm={setIsBidForm} />}

      <div>
        <ImageGrid
          origin={'vault'}
          contract={vault}
          uris={gammaUris}
          gamma={gamma}
        />
      </div>
    </div>
  )
}

export default Commons;
