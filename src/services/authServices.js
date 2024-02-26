// in this auth services file we will make api requests to backend using functions
// means we create different functions and make api requests to the backend which deals with the auth functions like login and register

// importing axios -> Axios is a promise-based HTTP library that lets developers make requests to either their own or a third-party server to fetch data
import axios from 'axios';

// specifying our backend server URL
// const SERVER_URL = 'http://localhost:5000/api'
const SERVER_URL = 'https://todoappbackend-itdg.onrender.com/api'

// function to register the user in the backend, i.e., database -> this function will call the backend to register the user
const registerUser = (data) => {
    return axios.post(SERVER_URL + '/register', data);
}

// function to login the user in the backend, i.e., database -> this function will call the backend to login the user
const loginUser = (data) => {
    return axios.post(SERVER_URL + '/login', data);
}

// creating an object and put the above function in this object
// then we will export the object
const AuthServices = { registerUser, loginUser };

// exporting the above object
export default AuthServices;