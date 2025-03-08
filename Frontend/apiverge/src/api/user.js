// src/api/user.js

import axios from 'axios';

/**
 * Creates a new user in the external Firestore via API.
 * @param {Object} payload - User data to be stored.
 * @param {string} idToken - Firebase ID token.
 * @returns {Promise<Object>} API response.
 */
export const createUserExternal = async (payload, idToken) => {
  try {
    const response = await axios.post(
      'https://apiverge-base-515423273437.us-central1.run.app/b/user/users',
      payload,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating external user:', error);
    throw error;
  }
};
