import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './comps/NavBar';
import Commons from './pages/Commons';
import About from './pages/About';
import OpenGallery from './pages/OpenGallery';
import UploadNFT from './pages/UploadNFT';
import NFT from './pages/NFT';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Router> 
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" exact component={Commons} />
          <Route path="/about" exact component={About} />
          <Route path="/open-gallery" exact component={OpenGallery} />
          <Route path="/uploadNFT" exact component={UploadNFT} />
          <Route path="/gallery" exact component={Gallery} />
          <Route path="/nft/:id" exact component={NFT} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
