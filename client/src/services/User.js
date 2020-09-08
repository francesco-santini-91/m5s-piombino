import axios from 'axios';

class User {
    constructor(token) {
        this.token = token;
    }


    isAuthenticated = async function(){
        var userInfo = {
            authorized: false,
            userID: '',
            username: '',
            avatar: '',
            isConfirmed: '',
            isAdmin: '',
            isSuperUser: '',
            isBanned: ''
        }
        if(this.token === null) {
            return userInfo;
        }
        else {
            await axios.post('http://localhost:4000/server/login/auth', {
                token: this.token
            })
            .then(response => {
                if(response.data.authorized === true) {
                    userInfo.authorized = true;
                    userInfo.userID = response.data.decoded.userID;
                    userInfo.username = response.data.decoded.username;
                    userInfo.avatar = response.data.decoded.avatar;
                    userInfo.isConfirmed = response.data.decoded.isConfirmed;
                    userInfo.isAdmin = response.data.decoded.isAdmin;
                    userInfo.isSuperUser = response.data.decoded.isSuperUser;
                    userInfo.isBanned = response.data.decoded.isBanned;
                }
            })
            .catch(function(errors) {
                console.log(errors);
            });
            return userInfo;
        }
    }

}

export default User;