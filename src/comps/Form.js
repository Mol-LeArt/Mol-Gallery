import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import './Form.css'
import { CommunityContext } from '../GlobalContext'

const Form = ({ setForm, contract, tokenId, gamma }) => {
  // ----- useState
  const [sale, setSale] = useState('')
  const [ethPrice, setEthPrice] = useState('')
  const [coinPrice, setCoinPrice] = useState('')

  // ----- useContext 
  const { commons } = useContext(CommunityContext)

  // ----- Reaect Router Config
  const history = useHistory()

  const clickBackdrop = (e) => {
    // classList is used to identify className
    if (e.target.classList.contains('backdrop')) {
      setForm(false)
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    console.log(contract.address, gamma)
    if (contract.address === gamma) {
      console.log('update gamma from vault')
      updateGammaSale()
    } else {
      console.log('update commons')
      updateCommonsGammaSale()
    }
  }

  // ----- Update sale for when Gamma leaves MolCommons
  const updateGammaSale = async () => {
    try {
      const p = ethers.utils.parseEther(ethPrice)
      const tx = await contract.updateSale(p, tokenId, sale)
      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait()
      console.log('update sale receipt is - ', receipt)
      history.push(`/${commons}`)
    } catch (e) {
      console.log(e.message)
    }
  }

  // ----- Update sale with MolCommons
  const updateCommonsGammaSale = async () => {
    try {
      const p = ethers.utils.parseEther(ethPrice)
      const c = ethers.utils.parseEther(coinPrice)
      const tx = await contract.updateGammaSale(tokenId, p, c, sale)

      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait()
      console.log('update sale receipt is - ', receipt)
      history.push(`/${commons}`)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='backdrop' onClick={clickBackdrop}>
      <form className='form'>
        <h1 className='form-title'>Update Sale</h1>

        <div>
          <label htmlFor='sale'>Put on sale?</label>
          <br />
          <input
            type='text'
            value={sale}
            onChange={(e) => setSale(e.target.value)}
            placeholder='Yes = 1, no = 0'
          />
        </div>

        <div>
          <label htmlFor='price'>Price in Ξ</label>
          <br />
          <input
            type='text'
            value={ethPrice}
            onChange={(e) => setEthPrice(e.target.value)}
            placeholder='Enter amount in Ξ'
          />
        </div>

        <div>
          <label htmlFor='coins'>Price in coins</label>
          <br />
          <input
            type='text'
            value={coinPrice}
            onChange={(e) => setCoinPrice(e.target.value)}
            placeholder='Enter number of coins'
          />
        </div>
        <button className='form-button' type='submit' onClick={handleClick}>
          Confirm
        </button>
      </form>
    </div>
  )
}

export default Form
