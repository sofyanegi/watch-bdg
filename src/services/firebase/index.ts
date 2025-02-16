/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from './init';
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';

const db = getFirestore(app);

export async function getCCTVCollection() {
  const cctvCollection = collection(db, 'cctv');
  const cctvSnapshot = await getDocs(cctvCollection);
  const cctvList = cctvSnapshot.docs.map((doc) => doc.data());
  return cctvList;
}

export async function storeDataUser(user: any) {
  try {
    const q = query(collection(db, 'users'), where('email', '==', user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const newUser = {
        ...user,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      const addedUserRef = await addDoc(collection(db, 'users'), newUser);

      return { id: addedUserRef.id, ...newUser };
    } else {
      const existingUser = querySnapshot.docs[0];
      return { id: existingUser.id, ...existingUser.data() };
    }
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
}
