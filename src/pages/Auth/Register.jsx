import React, { useState } from 'react'

// importing Links from react-router-dom
import { Link, useNavigate } from 'react-router-dom';

// importing login image
import login from '../../assets/login.png'

// importing input field from ant design
import { Button, Input, message } from 'antd';

// importing AuthServices file using this we can call the login functionality in the backend
import AuthServices from '../../services/authServices';

// importing Login.module.css file for Login page styling
import styles from './Login.module.css';

// importing error message
import { getErrorMessage } from '../../util/GetError';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  // creating a navigate object using the useNavigate() hook
  // this object allow us to change the route
  const navigate = useNavigate();

  // this function will call if the Register button is clicked
  const handleSubmit = async() => {
    try {
      // API call jane se pehle loading ko true mark krr denge
      setLoading(true);

      // create an object of the data that is passed in the login page
      let data = { firstName, lastName, username, password };

      // calling the loginUser function which is present in services folder in authServices file
      await AuthServices.registerUser(data);
      // const response = await AuthServices.registerUser(data);
      // console.log(response.data);

      // showing the popup message when the user successfully logged in
      message.success("Registered Successfully!");

      // after successful registration we navigate/redirect the user to the Login Route
      navigate('/');

      // API se data aane ke baad loading ko false mark krr denge
      setLoading(false);
    }
    catch(err) {
      // console.log(err);

      // getting error message
      message.error(getErrorMessage(err));

      // agr koi error aata hai to uske baad bhi loading ko false krr denge
      setLoading(false);
    }
  }

  return (
    <div>
      <div className={styles.login__card}>
        {/* adding login image */}
        <img src={login} alt='..'/>

        {/* adding Register heading */}
        <h2>Register</h2>

        {/* adding input fields for first name and last name */}
        <div className={styles.input__inline__wrapper}>
          <Input placeholder='Enter First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder='Enter Last Name' style={{marginLeft: '10px'}} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        {/* adding input fields for username */}
        <div className={styles.input__wrapper}>
          <Input placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        {/* adding input fields for password */}
        <div className={styles.input__wrapper}>
          <Input.Password placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* if the user is not register then we add a link here to sign up */}
        <div className={styles.input__info}>
          Have an account? <Link to="/login">Log in</Link>
        </div>

        {/* adding a button */}
        {/* agr username ya password dono me se koi bhi field empty hogi to Register ka button disable ho jayega */}
        <Button loading={loading} type='primary' size='large' disabled={!firstName || !lastName || !username || !password} onClick={handleSubmit}>Register</Button>
      </div>
    </div>
  )
}

export default Register
