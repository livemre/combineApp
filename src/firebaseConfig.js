import { initializeApp } from "firebase/app";

// Websitesinin firebase yapılandırmasını bu şekilde yapıyoruz.
const firebaseConfig = {
  apiKey: "AIzaSyDEwxLtMJtIURhPHcWf7gnnZxvXNv6eV1s",
  authDomain: "twitter-clone-ff067.firebaseapp.com",
  projectId: "twitter-clone-ff067",
  storageBucket: "twitter-clone-ff067.appspot.com",
  messagingSenderId: "1077167671047",
  appId: "1:1077167671047:web:e874dee1211bc18bca67a2",
};

const app = initializeApp(firebaseConfig);

export default app;
