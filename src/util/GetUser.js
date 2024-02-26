// this function will grab data from the local storage,
// when the user logged in, we are storing user's data in the local storage
// and this data is stored in the local storage as a string
// so, we convert the data into JSON format

export function getUserDetails() {
    let user = JSON.parse(localStorage.getItem('todoAppUser'));
    // console.log(user);
    return user;
}