import {
  getFirestore,
  where,
  query,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import {
  User,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import app from "../firebaseConfig";

const auth = getAuth();
const db = getFirestore(app);

interface UserData {
  username: string;
  email: string;
  profileImage: string;
  id: string;
  credit: number;
  desc: string;
}


// email ve password göndererek kullanıcı oluşturuyoruz. user döndürüyoruz.
export const register = async (email:string, password:string) : Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const login = async (email:string, password:string) : Promise<User>=> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

// gönderilen username firebase veritabanında "usernames" koleksiyonunda sorgulanıyor. geriye bool döndürülüyor.
export const checkUsername = async (username:string) :Promise<boolean> => {
  const usersRef = collection(db, "usernames");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Emaili verilen bir userin tüm verileri firebase den alınıyor ve geri döndürülüyor.
export const getUserData = async (email?:string, username?:string):Promise<UserData> => {
  // userRef adında bir değişken oluşturup, firebase fonk. olan "collection" ile "db" veritabanından
  // "users" koleksiyonunun yolunu belirtiyoruz.
  const usersRef = collection(db, "users");

  // "myQuery" ismi verilen değişken "userRef" yoluna query sorgu yapıyor ve
  //"where" fonk. ile "email" verisinin "email" attributuna eşit olma durumu sorgulanıyor.
 
  let myQuery:any;
  if(username) {
     myQuery = query(usersRef, where("username", "==", username));
  } else {
     myQuery = query(usersRef, where("email", "==", email));
    
  }

    // "quertSnapshot" değişkenine, firebase getDocs
  // fonksiyonu ile yukarıdaki myQuery sorgusundan dönen dosyaları geri döndürüyoruz.
  const querySnapshot = await getDocs(myQuery);

 
  

 
  
  // Eğer email ile eşleşen veri varsa dizi döndürüyor.
 try {
   //dönen verinin ilk objesi alınıyor.
   const userDoc = querySnapshot.docs[0];

   // .data() donksiyonu ile gelen objenin tüm verilerine ulaşıp döndürülüyor.

   const userDocData: UserData = userDoc.data() as UserData;
   return userDocData;
 } catch (error) {
  console.log("Kullanıcı bulunamadı." + error);
  throw new Error("Kullanıcı bulunamadı.");

 }



};




export async function registerUsertoFirestore(uid:string, email:string, username:string):Promise<void> {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    username: username,
    email: email,
    profileImage: "http://sportstipsfree.click/tweet/avatar.png",
    id: uid,
    credit: 5000,
    desc: "lorem ipsum dolor sit amet"
  });
}


export async function addCredit(id:string) {
  const userDocRef = collection(db, "users");
  const q = query(userDocRef,where("id","==",id));
  const quertSnapshot = getDocs(q);
  console.log((await quertSnapshot).docs);
  

}




export { db, auth, signOut };
