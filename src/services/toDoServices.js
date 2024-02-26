// in this todo services file we will make api requests to backend using functions
// means we create different functions and make api requests to the backend which deals with the todo functions like create todo, get todo, update todo, delete todo

// importing axios -> Axios is a promise-based HTTP library that lets developers make requests to either their own or a third-party server to fetch data
import axios from 'axios';
import { getUserDetails } from '../util/GetUser';

// specifying our backend server URL
// const SERVER_URL = 'http://localhost:5000/api/todo'
const SERVER_URL = 'https://todoappbackend-itdg.onrender.com/api/todo'

// this function will call getUserDetails() function, which then fetch the user details from the local storage
// and we fetch the token from the user details, and this token is used for Authorization of the user
const authHeaders = () => {
    // "?." means we are checking that token is present in local storage or not
    // if the token is present then userToken variable is assigned with the actual token
    // if the token is not present then userToken variable is assigned with null
    let user = getUserDetails();
    let token = user?.finalData?.token;
    
    // in return we pass the headers
    // which consists of token value
    return {headers:{'Authorization':token}}
}

// function to create the todo in the backend, i.e., database -> this function will call the backend to create the todo
const createToDo = (data) => {
    return axios.post(SERVER_URL + '/create-to-do', data, authHeaders());
}

// function to get all the todo from the backend, i.e., database -> this function will call the backend to get the todo
const getAllToDo = (userId) => {
    return axios.get(SERVER_URL + '/get-all-to-do/' + userId, authHeaders());
}

// function to update the todo in the backend, i.e., database -> this function will call the backend to update the todo
const updateToDo = (id, data) => {
    return axios.patch(SERVER_URL + '/update-to-do/' + id, data, authHeaders());
}

// function to delete the todo in the backend, i.e., database -> this function will call the backend to delete the todo
const deleteToDo = (id) => {
    return axios.delete(SERVER_URL + '/delete-to-do/' + id, authHeaders());
}

// creating an object and put the above function, i.e., createToDo in this object
// then we will export the object directly
const ToDoServices = { createToDo, getAllToDo, updateToDo, deleteToDo };

// exporting the above object
export default ToDoServices;