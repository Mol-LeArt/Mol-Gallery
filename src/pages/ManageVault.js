import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ABI from '../comps/MOLVAULT_ABI'
import bytecode from '../comps/MOLVAULT_BYTECODE'
import UploadVault from '../comps/UploadVault'
import { ContractFactory, ethers } from 'ethers'

const ManageVault = () => {
  // ----- Deploy MolVault
  const [owners1, setOwners1] = useState('')
  const [owners2, setOwners2] = useState('')
  const [confirmationsRequired, setConfirmationsRequired] = useState('')
  const [deployError, setDeployError] = useState(null)
  const [contract, setContract] = useState(null)

  // ----- Sell & Withdrawal from Vault
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')
  const [numSaleConfirmations, setNumSaleConfirmations] = useState('')
  const [numWithdrawalConfirmations, setNumWithdrawalConfirmations] = useState('')
  const [confirmSaleError, setConfirmSaleError] = useState(null)
  const [confirmWithdrawalError, setConfirmWithdrawalError] = useState(null)
  const [revokeSaleError, setRevokeSaleError] = useState(null)
  const [revokeWithdrawalError, setRevokeWithdrawalError] = useState(null)

  // ----- Remove GAMMA
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')

  // ----- Update owners (need to make this dynamic)
  const [newOwner1, setNewOwner1] = useState('')
  const [newOwner2, setNewOwner2] = useState('')

  // ----- Artist Roster
  const [artistToAdd, setArtistToAdd] = useState('')
  const [artistToRemove, setArtistToRemove] = useState('')

  // ----- Reacter Router Config
  const location = useLocation()
  const vault = location.state.vault

  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const factory = new ContractFactory(ABI, bytecode, signer)

  // ----- Deploy MolVault
  const deployVault = async () => {
    // hard coding owners array for now
    const owners = [owners1, owners2]

    if (owners.length > 0 && confirmationsRequired > 0) {
      try {
        const contract = await factory.deploy(owners, confirmationsRequired)

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

  const getNumConfirmationsRequired = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract
        .numConfirmationsRequired()
        .then((data) => setNumConfirmationsRequired(data))
    } catch (e) {
      console.log(e)
    }
  }

  const confirmSale = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      const tx = await _contract.confirmSale()
      tx.wait().then((receipt) => {
        _contract
          .numSaleConfirmations()
          .then((data) => setNumSaleConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
      setConfirmSaleError('You have already confirmed to withdraw funds from the vault!')
      }
    }
  }

  const revokeSale = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      const tx = await _contract.revokeSale()
      tx.wait().then(() => {
        _contract
          .numSaleConfirmations()
          .then((data) => setNumSaleConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setRevokeSaleError(
          'You have already revoked your vote to sell the vault!'
        )
      }
    }
  }

  const sellVault = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.sellVault()
    } catch (e) {
      if (e.code === 4001) {
        console.log(e.message)
      } else {
      console.log(e)
      }
    }
  }

  const getConfirmSale = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract
        .numSaleConfirmations()
        .then((data) => setNumSaleConfirmations(data))
    } catch (e) {
      console.log(e)
    }
  }

  const confirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      const tx = await _contract.confirmWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setConfirmWithdrawalError(
          'You have already confirmed to withdraw funds from the vault!'
        )
      }
    }
  }

  const revokeWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      const tx = await _contract.revokeWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
      })
    } catch (e) {
      console.log(e.code)
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        setRevokeWithdrawalError(
          'You have already revoked your vote to withdraw funds!'
        )
      }
    }
  }

  const executeWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.executeWithdrawal()
    } catch (e) {
      if (e.code === 4001) {
        console.log(e.message)
      } else {
        console.log(e.message)
      }
    }
  }

  const getConfirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract
        .numWithdrawalConfirmations()
        .then((data) => setNumWithdrawalConfirmations(data))
    } catch (e) {
      console.log(e)
    }
  }

  // will need to update MolVault ABI
  const getWhitelist = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.whitelist(0).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  const addToWhitelist = async () => {
    try {
      const artist = [artistToAdd]
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.addToWhitelist(artist).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  const removeFromWhitelist = async () => {
    try {
      const artist = [artistToRemove]
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.removeFromWhitelist(artist).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  const removeGamma = async () => {
    try {
      const nft = [tokenAddress, tokenId]
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.retrieveGamma(nft).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  const updateOwners = async () => {
    try {
      const owners = [newOwner1, newOwner2]
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.updateOwners(owners).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    // vault variable does not arrive so these glitch out on refresh
    getNumConfirmationsRequired()
    getConfirmSale()
    getConfirmWithdrawal()
    getWhitelist()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault])

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
              value={confirmationsRequired}
              onChange={(e) => setConfirmationsRequired(e.target.value)}
              placeholder='Number of confirmations'
            />
          )}
          {!vault && (
            <button onClick={deployVault}>
              Deploy Vault - deploy MolVault.sol
            </button>
          )}
          {deployError && <p>{deployError}</p>}
          Vault Contract: {vault}
          <br />
          <br />
          No. Confirmations Required for Sale and Withdrawal:{' '}
          {numConfirmationsRequired}
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
          <div>No. Sell Confirmations: {numSaleConfirmations}</div>
          {confirmSaleError && <p>{confirmSaleError}</p>}
          {revokeSaleError && <p>{revokeSaleError}</p>}
          <button onClick={confirmSale}>confirmSale</button>
          <button onClick={revokeSale}>revokeSale</button>
          <button onClick={sellVault}>sellVault</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Withdraw Funds from Vault</h2>
          <div>No. Withdrawal Confirmations: {numWithdrawalConfirmations}</div>
          {confirmWithdrawalError && <p>{confirmWithdrawalError}</p>}
          {revokeWithdrawalError && <p>{revokeWithdrawalError}</p>}
          <button onClick={confirmWithdrawal}>confirmWithdrawal</button>
          <button onClick={revokeWithdrawal}>revokeWithdrawal</button>
          <button onClick={executeWithdrawal}>executeWithdrawal</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Artist Roster</h2>
          <div>
            <input
              type='text'
              value={artistToAdd}
              onChange={(e) => setArtistToAdd(e.target.value)}
              placeholder='Enter artist address'
            />
            <button onClick={addToWhitelist}>addToWhitelist</button>
          </div>
          <div>
            <input
              type='text'
              value={artistToRemove}
              onChange={(e) => setArtistToRemove(e.target.value)}
              placeholder='Enter artist address'
            />
            <button onClick={removeFromWhitelist}>removeFromWhitelist</button>
          </div>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Remove GAMMA from Vault</h2>
          <input
            type='text'
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder='Enter token address'
          />
          <input
            type='text'
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder='Enter token id'
          />
          <button onClick={removeGamma}>removeGamma</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Owners</h2>
          <input
            type='text'
            value={newOwner1}
            onChange={(e) => setNewOwner1(e.target.value)}
            placeholder='Enter new owner'
          />
          <input
            type='text'
            value={newOwner2}
            onChange={(e) => setNewOwner2(e.target.value)}
            placeholder='Enter another new owner'
          />
          <button onClick={updateOwners}>updateOwners</button>
        </div>
      )}
    </div>
  )
}

export default ManageVault
