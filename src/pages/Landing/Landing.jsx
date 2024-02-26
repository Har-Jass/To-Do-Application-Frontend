import React from 'react';

// importing Navbar component
import Navbar from '../../components/Navbar';

// importing Links from react-router-dom
import { Link } from 'react-router-dom';

// importing landing image
import landing from '../../assets/landing.jpg';

// importing css file in which we write all the css needed for the landing page
import styles from './Landing.module.css';
import './Landing.module.css';

function Landing() {
  return (
    <div>
      {/* navigation bar */}
      <Navbar active={"home"}/>

      <div className={styles.landing__wrapper}>
        {/* left side text and buttons on home page */}
        <div className={styles.landing__text}>
          <h1>Schedule Your Daily Tasks With <span className='primaryText'>DoDo!</span></h1>
          <div className='btnWrapper'>
            <Link to="/register" className="primaryBtn">Register</Link>
            <Link to="/login" className="secondaryBtn">Login</Link>
          </div>
        </div>

        {/* right side image on the home page */}
        <div className={styles.landing__img}>
          <img src={landing} alt="landing"/>
        </div>
      </div>
    </div>
  )
}

export default Landing
