import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// import ImageGrid from '../comps/ImageGrid'
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'
import './Commons.css'

const Profile = () => {
  const [gRoyalties, setRoyalties] = useState(null)
  const [social, setSocial] = useState('')
  const [airdrop, setAirdrop] = useState('')

  // ----- React Router Config
  const location = useLocation()
  // const account = location.state.account
    const contract = location.state.contract


  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const _contract = new ethers.Contract(contract, ABI, signer)

  // const getContract = async () => {
  //   const query = await projectFirestore
  //     .collection('gallery')
  //     .where('account', '==', account)
  //     .get()

  //   query.forEach((doc) => {
  //     getTotalSupply(doc.data().contract)
  //     setContract(doc.data().contract)
  //   })
  // }

  const getTotalSupply = async (contract) => {
    const gRoyaltiesArray = []

    // const _contract = new ethers.Contract(contract, ABI, signer)
    contract.totalSupply().then((ts) => {
      for (var i = 1; i <= ts.toNumber(); i++) {
        contract.getRoyalties(i).then((r) => {
          console.log(r[0])
          gRoyaltiesArray.push(r[0])
          console.log(gRoyaltiesArray)
          setRoyalties([...gRoyaltiesArray])
        })
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()

    updateSocial(_contract)
  }

  const updateSocial = async (contract) => {
    try {
      const tx = await contract.setSocialAirdrop(social, airdrop)
      console.log('tx.hash for minting - ' + tx.hash)

      tx.wait().then((receipt) => {
        if (receipt.confirmations === 1) {
          console.log('mint receipt is - ', receipt)
          // history.push('/galleries')
        }
      })

    } catch (e) {
      console.log(e)
      if (e.code === 4001) {
        alert('MetaMask Tx Signature: User denied transaction signature.')
      }
    }
  }

  useEffect(() => {
    getTotalSupply(_contract)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className='commons-title'>Profile</h1>
      <p className='commons-desc'>
        This is your personal page. 
      </p>
      <h2>Royalties Tokens</h2>
      <p>Royalties payments from buying and selling your NFTs will automatically flow to these royalties tokens. Payments will sit in these royalties tokens until owners withdraw from the token contract. Owners may also gift or sell these tokens!</p>
      <br />
      {gRoyalties && gRoyalties.map((r, index) => <div key={index}>{r}</div>)}

      <br />
      <form >
        <h2>Set $social for airdrop</h2>

        <div>
          <label>Social Token</label>
          <br />
          <input
            type='text'
            value={social}
            onChange={(e) => setSocial(e.target.value)}
            placeholder='Enter Any Social Token'
          />
        </div>

        <div>
          <label>Amount</label>
          <br />
          <input
            type='text'
            value={airdrop}
            onChange={(e) => setAirdrop(e.target.value)}
            placeholder='Enter Amount to Airdrop'
          />
        </div>

        <button onClick={handleClick}>Submit</button>
      </form>
      {/* {uris && <ImageGrid contract={contract} uris={uris} />} */}
    </div>
  )
}

export default Profile
