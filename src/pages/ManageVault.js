import React, { useState } from 'react'
import ABI from '../comps/MOLVAULT_ABI'
import bytecode from '../comps/MOLVAULT_BYTECODE'
import UploadVault from '../comps/UploadVault'
import { ContractFactory, ethers } from 'ethers'

const ManageVault = ({ vault }) => {
  const [owners1, setOwners1] = useState('')
  const [owners2, setOwners2] = useState('')
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')
  const [deployError, setDeployError] = useState(null)
  const [contract, setContract] = useState(null)

  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const factory = new ContractFactory(ABI, bytecode, signer)

  // ----- Deploy MolVault
  const deployVault = async () => {
    // hard coding owners array for now
    const owners = [owners1, owners2]
    
    if (owners.length > 0 && numConfirmationsRequired > 0) {
      try {
        const contract = await factory.deploy(owners, numConfirmationsRequired)

        contract.deployTransaction
          .wait()
          .then((receipt) => {
            setContract(contract.address)
            console.log('Receipt for deploying MolVault', receipt)
          })
          .catch((e) => console.log(e))
      } catch (e) {
        console.log(e)
      }
    } else {
      setDeployError('You must enter owners and number of confirmations')
    }
  }

  return (
    <div>
      <div>
        <h1>Owner Functions</h1>
        <div>
          {!vault && (
            <input
              type='text'
              value={owners1}
              onChange={(e) => setOwners1(e.target.value)}
              placeholder='owners array'
            />
          )}

          {!vault && (
            <input
              type='text'
              value={owners2}
              onChange={(e) => setOwners2(e.target.value)}
              placeholder='owners array'
            />
          )}

          {!vault && (
            <input
              type='text'
              value={numConfirmationsRequired}
              onChange={(e) => setNumConfirmationsRequired(e.target.value)}
              placeholder='Number of confirmations'
            />
          )}

          {!vault && (
            <button onClick={deployVault}>
              Deploy Vault - deploy MolVault.sol
            </button>
          )}

          {deployError && <p>{deployError}</p>}
          {contract && <p>{contract}</p>}
        </div>
      </div>

      {contract && (
        <UploadVault
          contract={contract}
          owners={[owners1.toLowerCase(), owners2.toLowerCase()]}
        ></UploadVault>
      )}

      {(contract || vault) && (
        <div>
          <h2>Sell Vault</h2>
          <button>confirmSale</button>
          <button>revokeSale</button>
          <button>sellVault</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Withdraw Funds from Vault</h2>
          <button>confirmWithdrawal</button>
          <button>revokeWithdrawal</button>
          <button>executeWithdrawal</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Artist Roster</h2>
          <button>addToWhitelist</button>
          <button>removeFromWhitelist</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Remove GAMMA from Vault</h2>
          <button>retrieveGamma</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Owners</h2>
          <button>updateOwners</button>
        </div>
      )}
    </div>
  )
}

export default ManageVault
