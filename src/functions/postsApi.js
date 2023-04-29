import {
  collection,
  getDocs,
  query,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";

export async function getPosts() {
  const db = getFirestore();
  const postsRef = collection(db, "posts");
  const q = query(postsRef);

  const postList = [];

  const posts = await getDocs(q);

  posts.forEach((post) => {
    postList.push({ id: post.id, ...post.data() });
  });

  return postList;
}

export async function postPost(postId, post) {
  const db = getFirestore();
  await setDoc(doc(db, "posts", postId), post);
}
