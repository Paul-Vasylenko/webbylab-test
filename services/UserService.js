const db = require("../models");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/UserDto");
const tokenService = require("./TokenService");
const ApiError = require("../helpers/ApiError");
class UserService {
  async registration(email, name, password) {
    const existingUser = await db.User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) throw ApiError.badRequest("User exists");
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await db.User.create({
      email,
      name,
      password: hashPassword,
    });
    if (!user) {
      throw ApiError.badRequest("Can`t create user");
    }
    const userDto = new UserDto(
      user.getDataValue("id"),
      user.getDataValue("email"),
      user.getDataValue("name"),
      user.getDataValue("password")
    );
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email, password) {
    const existingUser = await db.User.findOne({
      where: {
        email,
      },
    });
    if (!existingUser) throw ApiError.badRequest("User doesn't exist");
    const isPassEqual = await bcrypt.compare(
      password,
      existingUser.getDataValue("password")
    );
    if (!isPassEqual) {
      throw ApiError.badRequest("Пароли не совпадают");
    }
    const userDto = new UserDto(
      existingUser.getDataValue("id"),
      existingUser.getDataValue("email"),
      existingUser.getDataValue("name"),
      existingUser.getDataValue("password")
    );
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
