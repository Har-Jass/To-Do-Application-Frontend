import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { getUserDetails } from '../util/GetUser';
import { Dropdown, message } from 'antd';
import avatar from '../assets/login.png'

function Navbar({active}) {
  const [user, setUser] = useState("");

  // creating a navigate object using the useNavigate() hook
  // this object allow us to change the route
  const navigate = useNavigate();

  // on the first render of our application, we check that we have the user or not
  // means we try to get the user from the local storage
  // if user present then we directly allow user to log in
  useEffect(() => {
    // grabbing the user from local storage using the getUserDetails() function
    // and this function is placed in utils folder and in GetUser file
    const userDetails = getUserDetails();

    // after getting the user details we set the user
    setUser(userDetails);
  }, []);

  // Logout pe click krte hi sbse pehle
  // LocalStorage me se user ko remove krenge
  // then message popup show krwa denge that user is logged out successfully
  // and then user ko home page pe navigate krwa denge
  const handleLogout = () => {
    localStorage.removeItem('todoAppUser');
    message.info("Logged Out Successfully!")
    navigate("/");
  }

  // items is nothing but a dropdown items list
  const items = [
    {
      key: '1',
      label: (
        // in the dropdown we add a Logout link
        // when the user clicks on Logout, he will automatically logged out from the application 
        // by clicking on Logout, handleLogout function will be called
        <span onClick={handleLogout}>
          Logout
        </span>
      )
    }
  ]

  return (
    <header>
      <nav>
        <div className='logo__wrapper'>
          <img src={logo} alt='logo'/>
          <h4>DoDo</h4>
        </div>

        <ul className='navigation-menu'>
          <li>
            <Link to="/" className={active==='home' && 'activeNav'}>Home</Link>
          </li>

          {/* checking if we get the user from local storage, then we directly send the user to the to-do-list route */}
          {
            user && <li><Link to="/to-do-list" className={active==='myTask' && 'activeNav'}>My Tasks</Link></li>
          }

          {
            user ? 
              <Dropdown menu={{items}} placement="bottom" arrow>
                <div className='userInfoNav'>
                  <img src={avatar} alt='.'/>
                  <span>
                    {
                      user?.finalData?.firstName ? `Hello, ${user?.finalData?.firstName} ${user?.finalData?.lastName}` : `Hello, ${user?.finalData?.username}`
                    }
                  </span>
                </div>
              </Dropdown>
            :
              <> 
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
          }
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
