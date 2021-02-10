import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'

import './Commons.css'

const Commons = () => {
  const [uris, setUris] = useState([])

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const contract = '0xada994f71399579c921fc13c16613b6a30280ab3'

  const getUri = async () => {
    const _contract = new ethers.Contract(contract, ABI, signer)

    _contract.getAllTokenURI().then((uri) => {
      setUris(uri)
    })
  }

  useEffect(() => {
    getUri()
    // console.log(contract)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className='commons-title'>Commons</h1>
      <p className='commons-desc'>
        Description for Commons goes here! Add ERC721 token name and token
        symbol here
      </p>

      <Link
        to={{
          pathname: '/mintNft',
          state: { },
        }}
      >
        <button>Upload Image</button>
      </Link>
      <ImageGrid uris={uris} />
    </div>
  )
}

export default Commons;
