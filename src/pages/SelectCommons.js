import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DeployVault from '../comps/DeployVault'
import './SelectCommons.css'

const SelectCommons = ({ vaultArry }) => {
  const [code, setCode] = useState('')
  const [err, setErr] = useState(null)
  const [canDeploy, setCanDeploy] = useState(false)
  const [vaults, setVaults] = useState('')

  const submitCode = () => {
    if (code === 'mol') {
      setErr(null)
      setCanDeploy(true)
    } else {
      setErr('No invite code found!')
    }
  }

  useEffect(() => {
    setVaults(vaultArry)
    console.log(vaultArry)
    return () => {}
  }, [])

  return (
    <div>
      <div className='select-commons'>
        <h2>Select a Commons</h2>
        <p className='select-commons-desc'>
          Each Commons is managed by a community!
        </p>

        {vaults &&
          vaults.map((vault, index) => (
            <div key={index}>
              <Link
                to={{
                  pathname: `/commons:${vault.contract}`,
                  state: {vault: vault.contract}
                }}
                style={{ textDecoration: 'none' }}
              >
                <button>{vault.name}</button>
              </Link>
            </div>
          ))}
      </div>

      <div className='deploy-commons'>
        <h2>Deploy a Commons</h2>
        <p>Do you have an invite code?</p>
        <input
          type='text'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='Enter invite code'
        />
        <button onClick={submitCode}>Submit</button>
        <p>---------------------</p>
        <div>
          {err && <p>{err}</p>}
          {canDeploy && <DeployVault />}
        </div>
      </div>
    </div>
  )
}

export default SelectCommons
