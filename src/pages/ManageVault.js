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
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [fundingGoal, setFundingGoal] = useState('')
  const [totalShares, setTotalShares] = useState('')
  const [lockPeriod, setLockPeriod] = useState('')

  const [deployError, setDeployError] = useState(null)
  const [contract, setContract] = useState(null)

  // ----- Sell & Withdrawal from Vault
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')
  const [numSaleConfirmations, setNumSaleConfirmations] = useState('')
  const [numWithdrawalConfirmations, setNumWithdrawalConfirmations] = useState(
    ''
  )
  const [confirmSaleError, setConfirmSaleError] = useState(null)
  const [confirmWithdrawalError, setConfirmWithdrawalError] = useState(null)
  const [revokeSaleError, setRevokeSaleError] = useState(null)
  const [revokeWithdrawalError, setRevokeWithdrawalError] = useState(null)

  // ----- Funding Goal
  const [vaultBalance, setVaultBalance] = useState('')
  const [onChainfundingGoal, setOnChainfundingGoal] = useState('')
  const [fundingPerc, setFundingPerc] = useState('')
  const [fundingCollectors, setFundingCollectors] = useState([])
  const [fundingCollectorsPerc, setFundingCollectorsPerc] = useState([])

  // ----- Bid
  const [bid, setBid] = useState('')
  const [bidder, setBidder] = useState('')
  const [proposedOwners, setProposedOwners] = useState([])

  // ----- Airdrop
  const [airdrop, setAirdrop] = useState(0)
  const [updatedAirdrop, setUpdatedAirdrop] = useState('')

  // ----- Artist Roster
  const [artists, setArtists] = useState([])
  const [artistToAdd, setArtistToAdd] = useState('')
  const [artistToRemove, setArtistToRemove] = useState('')

  // ----- Remove GAMMA
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')

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
        const contract = await factory.deploy(
          owners,
          confirmationsRequired,
          tokenName,
          tokenSymbol,
          fundingGoal,
          totalShares,
          lockPeriod
        )

        contract.deployTransaction
          .wait()
          .then((receipt) => {
            setContract(contract.address)
            console.log('Receipt for deploying MolVault', receipt)

            window.location.reload()
          })
          .catch((e) => console.log(e))
      } catch (e) {
        console.log(e)
      }
    } else {
      setDeployError('You must enter owners and number of confirmations')
    }
  }

  // ----- Get number of confirmations required
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

  // ----- Get bid and bidder
  const getBid = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.bid().then((data) => {
        const b = ethers.utils.formatEther(data)
        setBid(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getBidder = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.bidder().then((data) => {
        setBidder(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // Add function to get newOwners to MolVault.sol
  const getProposedOwners = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.getNewOwners().then((data) => {
        setProposedOwners(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Get funding data
  const getVaultBalance = async (contract) => {
    try {
      provider.getBalance(contract).then((data) => {
        const b = ethers.utils.formatEther(data)
        setVaultBalance(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingGoal = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.fundingGoal().then((data) => {
        const b = ethers.utils.formatEther(data)
        setOnChainfundingGoal(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingPerc = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.fundingGoalPerc().then((data) => {
        const b = ethers.utils.formatUnits(data, "wei")
        // console.log(data, b, 100 - parseInt(b, 10))
        setFundingPerc(100 - parseInt(b, 10))
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingCollectors = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.getFundingColectors().then((data) => {
        setFundingCollectors(data)
        getFundingCollectorsPerc(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingCollectorsPerc = async (collectors) => {
    const percArray = []
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      if (collectors) { 
        for (var i = 0; i < collectors.length; i++) {
          _contract.fundingCollectorPerc(collectors[i]).then((data) => {
            const b = ethers.utils.formatUnits(data, 'wei')
            console.log(b)
            percArray.push(b)
            setFundingCollectorsPerc([...percArray])
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Sell vault
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
        setConfirmSaleError(
          'You have already confirmed to withdraw funds from the vault!'
        )
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

  // ----- Withdraw funds from vault
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

  // ----- Manage airdrop
  const getAirdrop = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.airdrop().then((data) => {
        const a = ethers.utils.formatEther(data)
        setAirdrop(a)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const updateAirdrop = async () => {
    try {
      const a = ethers.utils.parseEther(updatedAirdrop)
      const _contract = new ethers.Contract(vault, ABI, signer)
      const tx = await _contract.updateAirdrop(a)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Artist roster
  const getWhitelist = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.getWhitelist().then((data) => {
        setArtists(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const addToWhitelist = async () => {
    try {
      const artist = [artistToAdd]
      const _contract = new ethers.Contract(vault, ABI, signer)
      const tx = await _contract.addToWhitelist(artist)
      tx.wait().then(() => {
        window.location.reload()
      })
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

  // ----- Remove Gamma from vault
  const removeGamma = async () => {
    try {
      const _contract = new ethers.Contract(vault, ABI, signer)
      _contract.removeGamma(tokenAddress, tokenId).then((data) => console.log(data))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    // vault variable does not arrive so these glitch out on refresh
    if (vault) {
      getNumConfirmationsRequired()
      getConfirmSale()
      getConfirmWithdrawal()
      getWhitelist()
      getAirdrop()
      getBid()
      getBidder()
      getProposedOwners()
      getVaultBalance(vault)
      getFundingGoal()
      getFundingPerc()
      getFundingCollectors()
      getFundingCollectorsPerc()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault])

  return (
    <div>
      <div>
        <h1>Owner Functions</h1>
        <div>
          <div>
            {!vault && (
              <input
                type='text'
                value={owners1}
                onChange={(e) => setOwners1(e.target.value)}
                placeholder='owners array'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={owners2}
                onChange={(e) => setOwners2(e.target.value)}
                placeholder='owners array'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={confirmationsRequired}
                onChange={(e) => setConfirmationsRequired(e.target.value)}
                placeholder='Number of confirmations'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder='Name for vault shares'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder='Symbol for vault shares'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
                placeholder='Enter funding goal'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={totalShares}
                onChange={(e) => setTotalShares(e.target.value)}
                placeholder='Enter total vault shares'
              />
            )}
          </div>
          <div>
            {!vault && (
              <input
                type='text'
                value={lockPeriod}
                onChange={(e) => setLockPeriod(e.target.value)}
                placeholder='Enter lock period for withdrawal'
              />
            )}
          </div>
          {!vault && (
            <button onClick={deployVault}>
              Deploy Vault - deploy MolVault.sol
            </button>
          )}
          {deployError && <p>{deployError}</p>}
          {(contract || vault) && <div> Vault Contract: {vault} </div>}
          {(contract || vault) && (
            <div>
              {' '}
              No. Confirmations Required for Sale and Withdrawal:{' '}
              {numConfirmationsRequired}{' '}
            </div>
          )}
          {(contract || vault) && <div> Vault Balance: {vaultBalance} Ξ</div>}
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
          <h2>Funding Goal</h2>
          <div>Funding goal: {onChainfundingGoal} Ξ</div>
          <div>Percentage funded: {fundingPerc} %</div>
          <div>
            Funding Collectors:
            <div>
              {fundingCollectors.map((collector, index) => (
                <p key={index}>{collector}</p>
              ))}
            </div>
          </div>
          <div>
            % per Funding Collectors:
            <div>
              {fundingCollectorsPerc.map((collector, index) => (
                <p key={index}>{collector}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Sell Vault</h2>
          <div>Highest bid: {bid} Ξ</div>
          <div>Highest bidder: {bidder}</div>
          <div>Proposed owners: {proposedOwners}</div>
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
          <h2>Airdrop Vault Coins</h2>
          <div>Current airdrop amount: {airdrop}</div>

          <input
            type='text'
            value={updatedAirdrop}
            onChange={(e) => setUpdatedAirdrop(e.target.value)}
            placeholder='Enter new amount to airdrop'
          />
          <button onClick={updateAirdrop}>updateAirdrop</button>
        </div>
      )}

      {(contract || vault) && (
        <div>
          <h2>Artist Roster</h2>
          {artists && (
            <div>
              {artists.map((artist, index) => (
                <p key={index}>{artist}</p>
              ))}
            </div>
          )}
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
    </div>
  )
}

export default ManageVault
