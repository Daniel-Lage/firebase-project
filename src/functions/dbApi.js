import {
  collection,
  getDocs,
  query,
  getFirestore,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";

export async function dbCreate(path, title, object) {
  await setDoc(doc(getFirestore(), path, title), object);
}

export async function dbRead(path) {
  const collectionRef = collection(getFirestore(), path);
  const q = query(collectionRef);
  const array = [];

  const snapshot = await getDocs(q);

  snapshot.forEach((post) => {
    array.push({ id: post.id, ...post.data() });
  });

  return array;
}

export async function dbReadFiltered(path, field, operation, value) {
  const collectionRef = collection(getFirestore(), path);
  const q = query(collectionRef, where(field, operation, value));
  const array = [];

  const snapshot = await getDocs(q);

  snapshot.forEach((post) => {
    array.push({ id: post.id, ...post.data() });
  });

  return array;
}

export async function dbReadDoc(path, id) {
  const docRef = doc(getFirestore(), path, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function dbUpdate(path, title, changes) {
  await updateDoc(doc(getFirestore(), path, title), changes);
}

export async function dbDelete(path, title) {
  await deleteDoc(doc(getFirestore(), path, title));
}
