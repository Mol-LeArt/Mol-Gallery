import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import { ethers } from 'ethers'
// import MOLGAMMA_ABI from '../comps/MOLGAMMA_ABI'
import MOLVAULT_ABI from '../comps/MOLVAULT_ABI'
import GAMMA_ABI from '../comps/GAMMA_ABI'
import './Commons.css'

const Commons = () => {
  const [gamma, setGamma] = useState('')
  const [gammaUris, setGammaUris] = useState([])
  // const [depositTokenUris, setDepositTokenUris] = useState([])
  const [bid, setBid] = useState('')
  const [proposedOwners, setProposedOwners] = useState('')
  const [isArtist, toggleIsArtist] = useState(false)
  const [isVaultOwner, toggleIsVaultOwner] = useState(false)

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

  // ----- Bid
  const bidVault = async () => {
    const _contract = new ethers.Contract(vault, MOLVAULT_ABI, signer)
    try {
      const newOwners = [proposedOwners]
      const overrides = { value: ethers.utils.parseEther(bid) }
      console.log(_contract)
      const tx = await _contract.bidVault(newOwners, overrides)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

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
            state: { vault: vault },
          }}
        >
          {isVaultOwner && <button>Vault</button>}
        </Link>
      </div>

      <div>
        <div>Any bid amount will be locked in contract</div>
        <input
          type='text'
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder='Enter bid'
        />
        <input
          type='text'
          value={proposedOwners}
          onChange={(e) => setProposedOwners(e.target.value)}
          placeholder='Enter proposed owners'
        />
        <button onClick={bidVault}>Bid on Vault</button>
      </div>

      <Link
        to={{
          pathname: '/mint',
          state: { commons: 'commons', contract: vault },
        }}
      >
        {isArtist && <button>Mint</button>}
      </Link>
      <ImageGrid
        origin={'vault'}
        contract={vault}
        uris={gammaUris}
        gamma={gamma}
      />
    </div>
  )
}

export default Commons;
