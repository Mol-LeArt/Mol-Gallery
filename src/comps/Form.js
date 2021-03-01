import React, { useState } from 'react'
import { ethers } from 'ethers'

import './Form.css'

const Form = ({ toggleForm, contract, tokenId, gamma }) => {
  const [sale, setSale] = useState('')
  const [price, setPrice] = useState('')

  const clickBackdrop = (e) => {
    // classList is used to identify className
    if (e.target.classList.contains('backdrop')) {
      toggleForm(false)
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    console.log('is token id #', tokenId, ' on sale?', sale, 'your price is ', price, )

    if (gamma) {
      console.log('update vault')
      updateVaultGammaSale()
    } else {
      console.log('update gamma')
      updateGammaSale(tokenId)
    }
  }

  const updateGammaSale = async (tokenId) => {
    try {
      const p = ethers.utils.parseEther(price)
      const tx = await contract.updateSale(p, tokenId, sale)
      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait()
      console.log('update sale receipt is - ', receipt)

      window.location.reload()
    } catch (e) {
      console.log(e.message)
    }
  }

  const updateVaultGammaSale = async () => {
    try {
      const p = ethers.utils.parseEther(price)
      const tx = await contract.updateSale(gamma, tokenId, p, 0, sale)

      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait().then(() => {
        window.location.reload()
        console.log('update sale receipt is - ', receipt)
      })
      

      
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Enter amount in Ξ'
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
