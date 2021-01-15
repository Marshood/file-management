import React ,{useEffect}from 'react'
import './Home.css'
import '../../../App.css'
import HeroSection from '../../HeroSection/HeroSection'
import Cards from '../../Cards/Cards';
import Footer from '../../Footer/Footer';
 function Home() {
  
    return (
        <div>
            <HeroSection/>
            <Cards />
            <Footer/>
        </div>
    )
}

export default Home
