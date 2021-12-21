const jwt = require("jsonwebtoken");
const db = require("../models");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.SECRET_ACCESS);
    } catch (e) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.SECRET_REFRESH);
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await db.Token.findOne({ where: { userId: 2 } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    return await db.Token.create(
      {
        refreshToken,
        userId,
      },
      {
        include: db.User,
      }
    );
  }
}

module.exports = new TokenService();
