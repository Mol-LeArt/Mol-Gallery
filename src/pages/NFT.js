import React from 'react'
// import { useLocation } from 'react-router-dom'
import useFirestore from '../hooks/useFirestore';
import ABI from '../comps/MOLGAMMA_ABI'
import { ethers } from 'ethers'

import './NFT.css' 

const NFT = ({ match }) => {
  // const [account, setAccount] = useState(null)
  const { docs } = useFirestore('nft')
  const img = docs
    .filter((nft) => nft.id === match.params.id)
    .map((nft) => nft.url)

  // Toggle buy button to collaborate for owner of NFT via contract interaction than via firestore.. more efficient

  // ----- Smart Contract Interaction Configuration
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const address = '0xe05AD5059dB36C23f08004Dfb535e36b8359DF3E'
  const molGammaContract = new ethers.Contract(address, ABI, signer)
  const num = 1000000000000000000
  const num2 = num.toString()

  // ----- Smart Contract Interaction
  async function molGamma(molGammaContract, ethPrice, tokenURI) {
    try {
      const tx = await molGammaContract.mint(1, ethPrice, tokenURI)
      console.log('this is tx.hash - ' + tx.hash)
      await tx.wait()
    } catch (e) {
      console.log(e)
      if (e.code === 4001) {
        alert('MetaMask Tx Signature: User denied transaction signature.')
      }
    }

    // const tx = await molGammaContract.mint(1, ethPrice, tokenURI)

    molGammaContract.on('Transfer', (from, to, tokenId) => {
      console.log(from, to)

      console.log('tokenId - ' + tokenId)
      // console.log("tokenId.hex - " +tokenId.hex);
      // console.log("tokenId._hex - " +tokenId._hex);
    })

    // const allURI = await molGammaContract.getAllTokenURI()
    // console.log('this is allURI - ' + allURI)
  }

  // async function getAccount() {
  //   window.ethereum
  //     .request({ method: 'eth_requestAccounts' })
  //     .then((result) => {
  //       console.log(result[0])
  //       setAccount(result[0])
  //     })
  // }

  // getAccount()

  function handleClick() {
    molGamma(molGammaContract, num2, img[0])
  }

  return (
    <div className='nft'>
      <img src={img} alt='' />

      <div>
        <div>
          Title:{' '}
          {docs
            .filter((nft) => nft.id === match.params.id)
            .map((filteredNFT) => filteredNFT.title)}
        </div>
        <div>
          Description:{' '}
          {docs
            .filter((nft) => nft.id === match.params.id)
            .map((filteredNFT) => filteredNFT.description)}
        </div>
        <div>Royalties: Need to get this from collection("gallery")</div>
        <button onClick={handleClick}>Buy</button>
      </div>
    </div>
  )
}

export default NFT
