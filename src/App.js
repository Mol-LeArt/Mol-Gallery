import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './comps/NavBar';
import Commons from './pages/Commons';
import About from './pages/About';
import OpenGallery from './pages/OpenGallery';
import MintNFT from './pages/MintNFT'
import NFT from './pages/NFT';
import Profile from './pages/Profile'
import Gallery from './pages/Gallery';
// import { ethers } from 'ethers'
import { projectFirestore } from './firebase/config'


function App() {
  const [account, setAccount] = useState(null)
  const [galleryExists, setGalleryExists] = useState(false)

  // Get Account Address
  async function getAccount() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        console.log("Account connected - " + result[0])
        setAccount(result[0])
    })
  }

  // Check if Account has a gallery to toggle
  // "Gallery" button in NavBar.js
  async function checkAccount(account) {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    query.forEach((doc) => {
      // console.log(doc.data())
      setGalleryExists(true)
    })
  }

  useEffect(() => {
    getAccount()
    checkAccount(account)
  }, [account])
  
  return (
    <Router>
      <div className='App'>
        <NavBar galleryExists={galleryExists} />
        <Switch>
          <Route path='/' exact component={Commons} />
          <Route path='/about' exact component={About} />
          <Route path='/profile' exact component={Profile} />
          <Route
            path='/open-gallery'
            exact
            component={() => <OpenGallery account={account} />}
          />
          <Route
            path='/MintNFT'
            exact
            component={() => <MintNFT account={account} />}
          />
          <Route
            path='/gallery'
            exact
            component={() => <Gallery account={account} />}
          />
          <Route path='/nft/:id' exact component={() => <NFT account={account} />} />
        </Switch>
      </div>
    </Router>
  )
}

export default App;
