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
  // const [coin, setCoin] = useState(null)
  const [gamma, setGamma] = useState(null)

  // ----- React router config
  const location = useLocation()
  const commons = location.state.commons
  const commonsName = location.state.commonsName

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  const getGamma = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      _contract.gamma().then((contract) => {
        setGamma(contract)
        console.log(contract)
      }).catch(e => {
        alert('You are on the wrong network!') 
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // const getCoin = async () => {
  //   const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
  //   try {
  //     _contract
  //       .coin()
  //       .then((contract) => {
  //         setCoin(contract)
  //       }).catch((e) => {
  //         console.log(e)
  //       })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  useEffect(() => {
    if (commons) {
      getGamma()
      // getCoin()
    }
    console.log(commons)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <div>
        <CommunityContext.Provider value={{ commons, commonsName, gamma }}>
          <NavBar />
          <Switch>
            <Route path='/community' exact component={() => <Commons />} />
            <Route path='/community/about' exact component={About} />
            <Route path='/community/arcade' exact component={Arcade} />
            <Route path='/profile/:account' exact component={Profile} />
            <Route
              path='/community/manage'
              exact
              component={() => <ManageCommons />}
            />
            <Route path='/community/mint' exact component={() => <MintNFT />} />

            <Route path='/community/:image' exact component={() => <NFT />} />
          </Switch>
        </CommunityContext.Provider>
      </div>
    </Router>
  )
}

export default Community
