import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Switch, Route, useParams, useLocation } from 'react-router-dom'
import { GlobalContext, CommunityContext } from '../GlobalContext'
import { ethers } from 'ethers'
import NavBar from '../comps/NavBar'
import Commons from '../pages/Commons'
import About from '../pages/About'
import Arcade from '../pages/Arcade'
import MintNFT from '../pages/MintNFT'
import NFT from '../pages/NFT'
import Profile from '../pages/Profile'
import ManageCommons from '../pages/ManageCommons'
import MOLCOMMONS_ABI from '../comps/MOLCOMMONS_ABI'

function Community() {
  const [coin, setCoin] = useState(null)
  const [gamma, setGamma] = useState(null)

  // ----- React router config
  const location = useLocation()
  const commonsName = location.state.commonsName
  let { commons } = useParams()

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  const getGamma = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      _contract.gamma().then((contract) => {
        setGamma(contract)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getCoin = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      _contract
        .coin()
        .then((contract) => {
          setCoin(contract)
        })
        .catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (commons) {
      getGamma()
      getCoin()
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <div>
        <CommunityContext.Provider value={{ commons, commonsName, gamma, coin }}>
          <NavBar />
          <Switch>
            <Route path='/:commons' exact component={() => <Commons />} />
            <Route path='/:commons/about' exact component={About} />
            <Route path='/:commons/arcade' exact component={Arcade} />
            <Route path='/profile/:account' exact component={Profile} />
            <Route
              path='/:commons/manage'
              exact
              component={() => <ManageCommons />}
            />
            <Route path='/:commons/mint' exact component={() => <MintNFT />} />

            <Route path='/:commons/:image' exact component={() => <NFT />} />
          </Switch>
        </CommunityContext.Provider>
      </div>
    </Router>
  )
}

export default Community
