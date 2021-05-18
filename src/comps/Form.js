import React, { useState, useContext } from 'react'
import { ethers } from 'ethers'
import './Form.css'
import { CommunityContext } from '../GlobalContext'
import MOLGAMMA_ABI from '../comps/MOLGAMMA_ABI'

const Form = ({ setForm, tokenId }) => {
  // ----- useState
  const [sale, setSale] = useState('')
  const [ethPrice, setEthPrice] = useState('')
  const [coinPrice, setCoinPrice] = useState('')

  // ----- useContext
  const { gamma } = useContext(CommunityContext)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  
  const clickBackdrop = (e) => {
    // classList is used to identify className
    if (e.target.classList.contains('backdrop')) {
      setForm(false)
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    updateSale()
  }

  // ----- Update sale for when Gamma leaves MolCommons
  const updateSale = async () => {
    const _contract = new ethers.Contract(gamma, MOLGAMMA_ABI, signer)
    try {
      const p = ethers.utils.parseEther(ethPrice)
      const tx = await _contract.updateSale(p, tokenId, sale)
      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait()
      console.log('update sale receipt is - ', receipt)
      window.location.reload()
    } catch (e) {
      console.log(e.message)
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

export default Form
