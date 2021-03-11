import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DeployVault from '../comps/DeployVault'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div class='mx-auto px-4 my-10 max-w-2xl space-y-10 font-primary flex-col justify-center'>
        <div class='text-5xl font-bold self-auto text-center'>
          Select a Commons
        </div>

        {vaults &&
          vaults.map((vault, index) => (
            <div class='text-center' key={index}>
              <Link
                to={{
                  pathname: `/commons/${vault.contract}`,
                  state: { vault: vault.contract },
                }}
                style={{ textDecoration: 'none' }}
              >
                <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'>
                  {vault.name}
                </button>
              </Link>
            </div>
          ))}
      </div>

      <div class='mx-auto px-4 my-10 max-w-2xl space-y-6 font-primary flex-col justify-center'>
        <div class='text-4xl font-semibold text-center'>Deploy a Commons</div>
        <div class='text-center'>Do you have an invite code?</div>
        <div class='text-center'>
          <input
            class='border border-gray-400 py-2 px-4 rounded-md focus:outline-none focus:border-gray-800 font-mono'
            type='text'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Enter invite code'
          />
          <button
            class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md font-mono'
            onClick={submitCode}
          >
            Submit
          </button>
        </div>

        <p class='text-center'>---------------------</p>
        <div class='text-center'>
          {err && <p>{err}</p>}
          {canDeploy && <DeployVault />}
        </div>
      </div>
    </div>
  )
}

export default SelectCommons
