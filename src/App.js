import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './comps/NavBar';
import Commons from './pages/Commons';
import About from './pages/About';
import OpenGallery from './pages/OpenGallery';
import UploadNFT from './pages/UploadNFT';
import Art from './pages/Art';
import Gallery from './pages/Gallery';


function App() {
  
  return (
    <Router> 
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" exact component={Commons} />
          <Route path="/about" component={About} />
          <Route path="/open-gallery" component={OpenGallery} />
          <Route path="/uploadNFT" component={UploadNFT} />
          <Route path="/art" component={Art} />
          <Route path="/gallery" component={Gallery} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
