const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log('No JWT cookie found');
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  console.log('Received Refresh Token:', refreshToken);

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  console.log('Found User:', foundUser);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.sendStatus(403);
    }

    if (foundUser.username !== decoded.username) {
      console.log('Username mismatch:', foundUser.username, decoded.username);
      return res.sendStatus(403);
    }
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },

      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '180s' }
    );

    console.log('New Access Token:', accessToken);
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
