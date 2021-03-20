import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import NavBar from '../comps/NavBar'
import Commons from '../pages/Commons'
import About from '../pages/About'
import Arcade from '../pages/Arcade'
import OpenGallery from '../pages/OpenGallery'
import MintNFT from '../pages/MintNFT'
import NFT from '../pages/NFT'
import Profile from '../pages/Profile'
import Gallery from '../pages/Gallery'
import Galleries from '../pages/Galleries'
import ManageCommons from '../pages/ManageCommons'
import { GlobalContext, CommunityContext } from '../GlobalContext'
require('dotenv').config()

function Community() {
  const { account, hasGallery } = useContext(GlobalContext)
  let { contract } = useParams()

  // Get all community related values and pass down via community context provider 

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <div>
        <CommunityContext.Provider value={{ contract }}>
          <NavBar />
          <Switch>
            <Route
              path='/:contract'
              exact
              component={() => <Commons />}
            />
            <Route path='/:contract/about' exact component={About} />
            <Route
              path='/:contract/arcade'
              exact
              component={Arcade}
            />
            <Route
              path='/:contract/galleries'
              exact
              component={Galleries}
            />
            <Route path='/profile/:account' exact component={Profile} />
            <Route
              path='/:contract/open-gallery'
              exact
              component={() => <OpenGallery account={account} />}
            />
            <Route
              path='/:contract/manage'
              exact
              component={() => <ManageCommons />}
            />
            <Route
              path='/:contract/mint'
              exact
              component={() => <MintNFT account={account} />}
            />
            <Route
              path='/gallery/:contract'
              exact
              component={() => <Gallery account={account} />}
            />
            <Route
              path='/nft/:image'
              exact
              component={() => <NFT account={account} />}
            />
          </Switch>
        </CommunityContext.Provider>
      </div>
    </Router>
  )
}

export default Community
