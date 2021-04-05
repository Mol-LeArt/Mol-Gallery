import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../comps/MOLCOMMONS_ABI'
import GAMMA_ABI from '../comps/GAMMA_ABI'
import { CommunityContext } from '../GlobalContext';

const Commons = () => {
  // ----- useState
  const [gammaUris, setGammaUris] = useState([])
  const [isCreator, setIsCreator] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // ----- useContext
  const { commons, commonsName, gamma } = useContext(CommunityContext)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- Get Gamma tokens
  const getGammaUri = async () => {
    const uris = []
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    try {
      _contract.totalSupply().then((num) => {
        for (var i = 1; i <= num.toNumber(); i++) {
          _contract.tokenURI(i).then((uri) => {
            uris.push(uri)
            console.log(uri)
            setGammaUris([...uris])
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Check owner status to toggle Admin button
  const isOwner = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      signer.getAddress().then((address) => {
        _contract
          .isOrganizer(address)
          .then((data) => {
            setIsAdmin(data)
          })
          .catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Check whitelist status to toggle Mint button
  const isWhitelisted = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)

    try {
      signer.getAddress().then((address) => {
        _contract.isCreator(address).then((data) => {
          setIsCreator(data)
        }).catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (commons) {
      isOwner()
      isWhitelisted()
    }

    console.log(commons)
    if (gamma) {
      getGammaUri()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='mx-auto px-4 my-16 max-w-5xl space-y-6 font-mono flex-col justify-center'>
      <div class='text-6xl font-bold text-center'>Commons</div>
      {/* <div class='max-w-2xl mx-auto text-center'>
        Admin - access limited to community organizers <br />
        Mint - access limited to whitelisted members <br />
      </div> */}
      <div class='flex justify-center space-x-4'>
        <div>
          <Link
            to={{
              pathname: `/community/manage`,
            }}
          >
            {isAdmin && (
              <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'>
                Admin
              </button>
            )}
          </Link>
        </div>

        <div>
          <Link
            to={{
              pathname: `/community/mint`,
            }}
          >
            {isCreator && (
              <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'>
                Mint
              </button>
            )}
          </Link>
        </div>
      </div>

      <div>
        <ImageGrid uris={gammaUris} />
      </div>
    </div>
  )
}

export default Commons;
