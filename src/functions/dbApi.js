import {
  collection,
  getDocs,
  query,
  getFirestore,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export async function collectionGet(path) {
  const collectionRef = collection(getFirestore(), path);
  const q = query(collectionRef);

  const array = [];

  const snapshot = await getDocs(q);

  snapshot.forEach((post) => {
    array.push({ id: post.id, ...post.data() });
  });

  return array;
}

export async function collectionPost(path, title, object) {
  const db = getFirestore();
  await setDoc(doc(getFirestore(), path, title), object);
}

export async function collectionDelete(path, title) {
  await deleteDoc(doc(getFirestore(), path, title));
}

export async function collectionUpdate(path, title, changes) {
  await updateDoc(doc(getFirestore(), path, title), changes);
}
