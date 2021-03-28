import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DeployCommons from '../comps/DeployCommons'

const SelectCommunity = ({ vaultArry }) => {
  const [code, setCode] = useState('')
  const [err, setErr] = useState(null)
  const [canDeploy, setCanDeploy] = useState(false)
  const [commons, setCommons] = useState('')

  const submitCode = () => {
    if (code === 'mol') {
      setErr(null)
      setCanDeploy(true)
    } else {
      setErr('No invite code found!')
    }
  }

  useEffect(() => {
    setCommons(vaultArry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div class='mx-auto px-4 my-20 max-w-4xl space-y-10 flex-col justify-center'>
        <div class='text-5xl font-bold self-auto text-center'>
          Select a Community
        </div>

        <div class='max-w-2xl mx-auto grid grid-cols-2 gap-4 place-items-center'>
          {commons &&
            commons.map((commons, index) => (
              <div key={index}>
                <Link
                  to={{
                    pathname: `/${commons.contract}`,
                    state: { commonsName: commons.name },
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider font-mono'>
                    {commons.name} on {commons.chain}
                  </button>
                </Link>
              </div>
            ))}
        </div>
      </div>

      <div class='mx-auto px-4 my-10 max-w-2xl space-y-6 flex-col justify-center text-gray-400'>
        <div class='text-4xl my-5 font-semibold text-center'>
          Summon a Community
        </div>
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
          {canDeploy && <DeployCommons />}
        </div>
      </div>
    </div>
  )
}

export default SelectCommunity
