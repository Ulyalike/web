const crypto = require('crypto');

/**
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

module.exports = hashPassword;
