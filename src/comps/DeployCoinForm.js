import React, { useState, useContext } from 'react'
import { ContractFactory, ethers } from 'ethers'
import './Form.css'
import { CommunityContext } from '../GlobalContext'
import COIN_ABI from './COIN_ABI'
import COIN_BYTECODE from './COIN_BYTECODE'
import { projectFirestore } from '../firebase/config'

const DeployCoinForm = ({ setForm }) => {
  // ----- useState
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [totalSupplyCap, setTotalSupplyCap] = useState('')
  const [transferability, setTransferability] = useState('')

  // ----- useContext
  const { commons } = useContext(CommunityContext)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const factory = new ContractFactory(COIN_ABI, COIN_BYTECODE, signer)

  const clickBackdrop = (e) => {
    // classList is used to identify className
    if (e.target.classList.contains('backdrop')) {
      setForm(false)
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    deployCoin()
  }

  // ----- Update sale for when Gamma leaves MolCommons
  const deployCoin = async () => {
    try {
      const _contract = await factory.deploy(
        name,
        symbol,
        commons,
        totalSupplyCap,
        totalSupplyCap,
        transferability
      )

      _contract.deployTransaction
        .wait()
        .then((receipt) => {
          console.log('Receipt for deploying Coin', receipt)
          uploadCoinAddress(receipt.contractAddress)
        })
        .catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }

  // Add buyer to Firestore
  const uploadCoinAddress = async (coin) => {
    console.log(coin)
    const docRef = projectFirestore.collection('vault').doc(commons)

    docRef.update({
      coin: coin,
    })
  }


  return (
    <div className='backdrop' onClick={clickBackdrop}>
      <form className='form'>
        <h1 className='form-title'>Deploy Coin</h1>

        <div>
          <label htmlFor='name'>Token Name</label>
          <br />
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter Token Name'
          />
        </div>

        <div>
          <label htmlFor='symbol'>Token Symbol</label>
          <br />
          <input
            type='text'
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder='Enter token symbol'
          />
        </div>

        <div>
          <label htmlFor='symbol'>Total Supply</label>
          <br />
          <input
            type='text'
            value={totalSupplyCap}
            onChange={(e) => setTotalSupplyCap(e.target.value)}
            placeholder='Enter token symbol'
          />
        </div>

        <div>
          <label htmlFor='symbol'>Transferability</label>
          <br />
          <input
            type='text'
            value={transferability}
            onChange={(e) => setTransferability(e.target.value)}
            placeholder='Enter token symbol'
          />
        </div>
        {/* <div>
          <label htmlFor='coins'>Price in coins</label>
          <br />
          <input
            type='text'
            value={coinPrice}
            onChange={(e) => setCoinPrice(e.target.value)}
            placeholder='Enter number of coins'
          />
        </div> */}
        <button className='form-button' type='submit' onClick={handleClick}>
          Confirm
        </button>
      </form>
    </div>
  )
}

export default DeployCoinForm
