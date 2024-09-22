const bcrypt = require('bcryptjs');

const hash = (password) => {
  return bcrypt.hashSync(password)
}

const compare = (password, hashedPass) => {
  return bcrypt.compareSync(password, hashedPass)
}

module.exports = { hash, compare }