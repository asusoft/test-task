const { db, auth } = require('../firebase/admin');
const TokenService = require('../services/tokenService');

module.exports = {
  Query: {
    getMe: async (_, __, { req }) => {
        const token = req.headers.authorization;
        if (!token) {
          throw new Error('Authorization token missing');
        }
      
        const userId = await TokenService.get_id_from_access_token(token);
      
        if (!userId) {
          throw new Error('Invalid or expired token');
        }

        const userDoc = await db.collection('users').doc(userId).get();

        console.log(userDoc)
        if (!userDoc.exists) {
          throw new Error('User not found');
        }
      
        return { id: userDoc.id, ...userDoc.data() };
      }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { email, password, name, role } = input;

      const userRecord = await auth.createUser({ email, password });

      const userData = {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('users').doc(userRecord.uid).set(userData);

      const accessToken = await TokenService.createAccessToken(userRecord.uid);
      const refreshToken = await TokenService.createRefreshToken(userRecord.uid);

      return {
        user: { id: userRecord.uid, ...userData },
        tokens: { accessToken, refreshToken },
      };
    },
    signIn: async (_, { input }) => {
        const { email, password } = input;
      
        try {
          const axios = require('axios');
          const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
      
          const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
              email,
              password,
              returnSecureToken: true,
            }
          );
      
          const { idToken, refreshToken, localId } = response.data;
          const userDoc = await db.collection('users').doc(localId).get();
          if (!userDoc.exists) {
            throw new Error('User not found in Firestore');
          }
      
          const userData = userDoc.data();
          const customAccessToken = await TokenService.createAccessToken(localId);
          const customRefreshToken = await TokenService.createRefreshToken(localId);
      
          return {
              accessToken: customAccessToken,
              refreshToken: customRefreshToken,
          };
        } catch (error) {
          console.error('Sign-in error:', error.message);
          throw new Error('Invalid email or password');
        }
      },
    updateUser: async (_, { input }) => {
      const { id, ...updates } = input;
      await db.collection('users').doc(id).update({ ...updates, updatedAt: new Date().toISOString() });
      const updatedUser = await db.collection('users').doc(id).get();
      return { id, ...updatedUser.data() };
    },
  },
};
