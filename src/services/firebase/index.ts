import { app } from './init';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export async function getCCTVCollection() {
  const db = getFirestore(app);
  const cctvCollection = collection(db, 'cctv');
  const cctvSnapshot = await getDocs(cctvCollection);
  const cctvList = cctvSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return cctvList;
}
