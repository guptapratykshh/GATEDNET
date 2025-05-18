import { signInWithCustomToken } from "firebase/auth";
import { auth } from "./firebase"; // your firebase config

export async function getIdTokenFromCustomToken(token) {
  if (!token) throw new Error("Invalid token");
  const userCredential = await signInWithCustomToken(auth, token);
  return userCredential.user.getIdToken();
}