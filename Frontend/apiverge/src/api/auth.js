// src/api/auth.js

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Creates a new Firebase user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Firebase user
 */
export const signupUser = async (email, password) => {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

/**
 * Logs in an existing Firebase user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Firebase user
 */
export const loginUser = async (email, password) => {
  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

/**
 * Logs out the current Firebase user.
 */
export const logoutUser = async () => {
  const auth = getAuth();
  await signOut(auth);
};
