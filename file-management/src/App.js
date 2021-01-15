import React from 'react'
import Navbar from './components/Navbar/Navbar';
import HeroSection from './components/HeroSection/HeroSection'
import Home from './components/pages/Home/Home'
import MainPage from './components/pages/MainPage/MainPage'
import Files from './components/pages/Files/Files'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
 
function App() {
  return (
    <>
    <Router>
      <Navbar />
       <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/MainPage' exact component={MainPage} />
        <Route path='/products' component={Files} />
        <Route path='/Home' component={Home} />

        {/* <Route path='/services' component={Services} />
      
        <Route path='/sign-up' component={SignUp} /> */}
      </Switch>
    </Router>
  </>
  )
}

export default App