import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext, CommunityContext } from '../GlobalContext'
import { ethers } from 'ethers'
import GAMMA_ABI from '../comps/GAMMA_ABI'
import GROYALTIES_ABI from '../comps/GROYALTIES_ABI'

const Profile = () => {
  // ----- useState
  const [gRoyalties, setRoyalties] = useState(null)

  // ----- useContext
  const { account } = useContext(GlobalContext)
  const { gamma } = useContext(CommunityContext)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
 
  // ----- Get functions
  const getGammaSupply = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .totalSupply()
      .then((data) => {
        const s = ethers.utils.formatUnits(data, 'wei')
        getRoyaltiesTokens(Math.trunc(s))
      })
      .catch((e) => console.log(e))
  }

  const getRoyaltiesTokens = async (supply) => {
    const array = []

    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    for (let i = 1; i <= supply; i++) {
      _contract.gRoyaltiesByTokenId(i)
      .then((token) => {
        const _contract = new ethers.Contract(token, GROYALTIES_ABI, signer)

        _contract.ownerOf(1).then((data) => {
          if (data.toLowerCase() === account) {
            array.push(token)
            setRoyalties([...array])
          } else console.log('Found nothing!')
        })
      })
      .catch((e) => console.log(e))
    }
  }

  useEffect(() => {
    getGammaSupply()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='mx-auto px-4 my-16 max-w-2xl space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Royalties Tokens
      </div>
      <div class='pb-5 text-left text-gray-400'>
        1. When you mint an NFT in this community, a royalties token is minted for you. 
        <br />
        2. These tokens receive royalties payments automatically whenever your NFT is sold. 
        <br/>
        3. You may withdraw royalties payments from these tokens. You may also gift or sell these tokens!
      </div>
      
      {!gRoyalties && <div class='text-center'>🤷 You have no royalties token! 🤷</div>}
      {gRoyalties && gRoyalties.map((r, index) => <div key={index} class='text-center'>{r}</div>)}

      {/* {uris && <ImageGrid contract={contract} uris={uris} />} */}
    </div>
  )
}

export default Profile
