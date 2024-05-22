const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
      this.users = data;
    },
  };
const bcrypt = require('bcrypt')
const handleLogin = async (req, res) => {}


// /Users/seancarrigan/repos/express/Node_Server/config