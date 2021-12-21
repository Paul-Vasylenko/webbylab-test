class UserDto {
  constructor(id, email, name, password) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
module.exports = UserDto;