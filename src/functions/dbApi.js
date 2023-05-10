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

export async function read(path) {
  const collectionRef = collection(getFirestore(), path);
  const q = query(collectionRef);
  const array = [];

  const snapshot = await getDocs(q);

  snapshot.forEach((post) => {
    array.push({ id: post.id, ...post.data() });
  });

  return array;
}

export async function insert(path, title, object) {
  await setDoc(doc(getFirestore(), path, title), object);
}

export async function remove(path, title) {
  await deleteDoc(doc(getFirestore(), path, title));
}

export async function update(path, title, changes) {
  await updateDoc(doc(getFirestore(), path, title), changes);
}
