import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './comps/NavBar';
import Commons from './pages/Commons';
import About from './pages/About';
import Arcade from './pages/Arcade'
import OpenGallery from './pages/OpenGallery';
import MintNFT from './pages/MintNFT'
import NFT from './pages/NFT';
import Profile from './pages/Profile'
import Gallery from './pages/Gallery'
import Galleries from './pages/Galleries'
import ManageVault from './pages/ManageVault'
import SelectCommons from './pages/SelectCommons'
import { projectFirestore } from './firebase/config'
require('dotenv').config()


function App() {
  const [account, setAccount] = useState(null)
  const [hasGallery, setHasGallery] = useState(false)
  const [vaultArry, setVaultArry] = useState([])

  const getAccount = async () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        console.log("Account connected - " + result[0])
        setAccount(result[0])
        getGallery(result[0])
    })
  }

  const getGallery = async (account) => {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    if (!query.empty) {
      setHasGallery(true)
    }
  }

  const getAllVaults = async () => {
    const vaultArray = []
    const query = await projectFirestore.collection('vault').get()
    query.forEach((doc) => {
      const vault = {
        contract: doc.data().contract,
        name: doc.data().name,
      }
      vaultArray.push(vault)
      setVaultArry([...vaultArray])
    })
  }

  useEffect(() => {
    getAccount()
    getAllVaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Router>
      <div className='App'>
        <NavBar hasGallery={hasGallery} />
        <Switch>
          <Route path='/commons/:contract' exact component={() => <Commons />} />
          <Route
            path='/'
            exact
            component={() => <SelectCommons vaultArry={vaultArry} />}
          />
          <Route path='/about' exact component={About} />
          <Route path='/arcade' exact component={Arcade} />
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
