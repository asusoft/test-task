const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = 'nd4983hiwfbvs2&48f9**djcniuwrfbfdvinfbkhsd'
const JWT_REFRESH_SECRET = '474rfhdfbjdvhjdcsytewriofre&647$wfbfs_47'

class TokenService {
  /**
   * Create an Access Token
   * @param {string} userId - The user's unique ID
   * @returns {string} - A signed JWT access token
   */
  async createAccessToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: '24h', // Access token expires in 5 minutes
    });
  }

  /**
   * Create a Refresh Token
   * @param {string} userId - The user's unique ID
   * @returns {string} - A signed JWT refresh token
   */
  async createRefreshToken(userId) {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
      expiresIn: '24h', // Refresh token expires in 24 hours
    });
  }

  /**
   * Validate and Extract User ID from an Access Token
   * @param {string} token - The JWT access token
   * @returns {string|null} - The user's ID or null if invalid
   */
  async get_id_from_access_token(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId || null;
    } catch (error) {
      console.error('Access Token Validation Error:', error.message);
      return null;
    }
  }

  /**
   * Validate and Extract User ID from a Refresh Token
   * @param {string} token - The JWT refresh token
   * @returns {string|null} - The user's ID or null if invalid
   */
  async validateRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      return decoded.userId || null;
    } catch (error) {
      console.error('Refresh Token Validation Error:', error.message);
      return null;
    }
  }

  /**
   * Refresh Access Token using a valid Refresh Token
   * @param {string} refreshToken - The JWT refresh token
   * @returns {string|null} - A new access token or null if invalid
   */
  async refreshAccessToken(refreshToken) {
    try {
      const userId = await this.validateRefreshToken(refreshToken);
      if (!userId) {
        throw new Error('Invalid refresh token');
      }
      return this.createAccessToken(userId);
    } catch (error) {
      console.error('Token Refresh Error:', error.message);
      throw new Error('Refresh token is invalid or expired');
    }
  }

  /**
   * Revoke a Token (e.g., during logout)
   * @param {string} token - The JWT token to revoke
   */
  revokeToken(token) {
    // Optional: Implement a blacklist mechanism or other revocation logic
    console.log(`Token ${token} revoked`);
  }
}

module.exports = new TokenService();
