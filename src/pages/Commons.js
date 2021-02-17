import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'

import './Commons.css'

const Commons = ({ hasVault }) => {
  const [uris, setUris] = useState([])

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const contract = '0xeC280B88EafBe70fA63669bf106DE0e46aF5E0EB'

  const getUri = async () => {
    const _contract = new ethers.Contract(contract, ABI, signer)

    _contract.getAllTokenURI().then((uris) => {
      setUris(uris)
      console.log(uris)
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    getUri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className='commons-title'>Commons</h1>
      <p className='commons-desc'>
        Mol's Commons is open to the public <br />
        Anyone can mint here <br />
        You can also navigate over to Galleries to see works by Mol's member
      </p>
      <div>
        <Link
          to={{
            pathname: '/manage',
            state: { hasVault: hasVault },
          }}
        >
          <button>Vault</button>
        </Link>
      </div>

      <div>
        <button>Bid on Vault</button>
      </div>

      <div>
        <button>Deposit</button>
      </div>

      <Link
        to={{
          pathname: '/mint',
          state: { commons: 'commons', contract: contract },
        }}
      >
        <button>Mint</button>
      </Link>
      <ImageGrid contract={contract} uris={uris} />
    </div>
  )
}

export default Commons;
