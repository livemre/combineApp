import {
  getFirestore,
  where,
  query,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import app from "../firebaseConfig";

const auth = getAuth();
const db = getFirestore(app);

// email ve password göndererek kullanıcı oluşturuyoruz. user döndürüyoruz.
export const register = async (email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const login = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

// gönderilen username firebase veritabanında "usernames" koleksiyonunda sorgulanıyor. geriye bool döndürülüyor.
export const checkUsername = async (username) => {
  const usersRef = collection(db, "usernames");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Emaili verilen bir userin tüm verileri firebase den alınıyor ve geri döndürülüyor.
export const getUserData = async (email) => {
  // userRef adında bir değişken oluşturup, firebase fonk. olan "collection" ile "db" veritabanından
  // "users" koleksiyonunun yolunu belirtiyoruz.
  const usersRef = collection(db, "users");

  // "myQuery" ismi verilen değişken "userRef" yoluna query sorgu yapıyor ve
  //"where" fonk. ile "email" verisinin "email" attributuna eşit olma durumu sorgulanıyor.
  const myQuery = query(usersRef, where("email", "==", email));

  // "quertSnapshot" değişkenine, firebase getDocs
  // fonksiyonu ile yukarıdaki myQuery sorgusundan dönen dosyaları geri döndürüyoruz.
  const querySnapshot = await getDocs(myQuery);

  // Eğer email ile eşleşen veri varsa dizi döndürüyor.
  if (!querySnapshot.empty) {
    //dönen verinin ilk objesi alınıyor.
    const userDoc = querySnapshot.docs[0];

    // .data() donksiyonu ile gelen objenin tüm verilerine ulaşıp döndürülüyor.

    return userDoc.data();
  } else {
    console.log("Kullanıcı bulunamadı.");
    return null;
  }
};

export async function registerUsertoFirestore(uid, email, username) {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    username: username,
    email: email,
    profileImage: "http://sportstipsfree.click/tweet/avatar.png",
    id: uid,
    credit: 5000,
  });
}

export { db, auth, signOut };
