import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './comps/NavBar';
import Commons from './pages/Commons';
import About from './pages/About';
import OpenGallery from './pages/OpenGallery';
import MintNFT from './pages/MintNFT'
import NFT from './pages/NFT';
import Profile from './pages/Profile'
import Gallery from './pages/Gallery'
import Galleries from './pages/Galleries'
import ManageVault from './pages/ManageVault'
// import { ethers } from 'ethers'
import { projectFirestore } from './firebase/config'


function App() {
  const [account, setAccount] = useState(null)
  const [hasGallery, toggleHasGallery] = useState(false)
  const [vault, setVault] = useState(null)

  const getAccount = async () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        console.log("Account connected - " + result[0])
        setAccount(result[0])
        getGallery(result[0])
        getVault(result[0])
    })
  }

  const getGallery = async (account) => {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    if (!query.empty) {
      toggleHasGallery(true)
    }
  }

  const getVault = async (account) => {
    const query = await projectFirestore.collection('vault').where('owners', 'array-contains', account).get()
    // console.log(query.empty)


    query.forEach((doc) => {
      setVault(doc.data().contract)
    })
  }

  useEffect(() => {
    getAccount()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Router>
      <div className='App'>
        <NavBar hasGallery={hasGallery} />
        <Switch>
          <Route path='/' exact component={() => <Commons vault={vault} />} />
          <Route path='/about' exact component={About} />
          <Route path='/galleries' exact component={Galleries} />
          <Route path='/profile/:account' exact component={Profile} />
          <Route
            path='/open-gallery'
            exact
            component={() => <OpenGallery account={account} />}
          />
          <Route path='/manage' exact component={() => <ManageVault />} />
          <Route
            path='/mint'
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
      </div>
    </Router>
  )
}

export default App;
