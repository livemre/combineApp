import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// bu fonksiyon ile emaili verilen kullanıcının tüm verileri alınıyor ve geri döndürülüyor.
import { getUserData } from "./services/firebase";

// Firebase fonksiyonları import ediliyor. Auth durumu değişikliği kontrol etmek ve getAuth ile auth bilgisi almak için.
import { onAuthStateChanged, getAuth, User } from "firebase/auth";

//Pages importu
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AllCombines from "./pages/AllCombines";
import UserProfile from "./pages/UserProfile";

//Context importu
import { MainContext } from "./context/Context";

import AddMatch from "./components/AddMatch";

import "./App.css";
import MyCombines from "./pages/MyCombines";
import EditProfile from "./pages/profile/EditProfile";

function App() {
  // Kullanıcının tüm verileri için stateler oluşturuluyor.
  const [user, setUser] = useState<User|null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [credit, setCredit] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const auth = getAuth();



  // Data objesi içinde tüm stateler toplanıyor.
  const data = {
    user,
    setUser,
    email,
    setEmail,
    profileImage,
    setProfileImage,
    credit,
    setCredit,
    id,
    username,
    setUsername,
  };

  // Siteye girildiğinde bu fonksiyon bir kez çalışır ve userın login logout durumları dinlenerek setUser
  // fonkstionuna user aktarılır.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      console.log(u);
    });

    // Uygulamadan çıkıldığında veya bu bileşen ekrandan kalktığında,
    // oturum durumu değişikliklerini dinlemeyi sonlandırır.
    // Bu, gereksiz dinlemelerin önlenmesi ve performansın korunması için yapılır.

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    async function getData() {
      //getuserData fonksiyonuna email adresi yolluyoruz ve geri gelen veriyi callback ile alıyoruz.
      await getUserData(user?.email ?? "").then((data) => {
        console.log(data);
        // data callback ile gelen verileri set fonksiyonu ile statelere aktarıyoruz.
        if (data) {
          setEmail(data.email);
          setProfileImage(data.profileImage);
          setCredit(data.credit);
          setUsername(data.username);
          setId(data.id);
        }
      });
    }

    if (!loading) {
      if (!user) {
        console.log("User yok!");
      } else {
        getData();
      }
    }
  }, [loading, user]);

  return (
    // Context ile sarmalıyoruz. Data objesini her yere dağıtıyoruz.
    <MainContext.Provider value={data}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addMatch" element={<AddMatch />} />
          <Route path="/allcombines" element={<AllCombines />} />
          <Route path="/u/:username" element={<UserProfile />} />
          <Route path="/myCombines" element={<MyCombines />} />
          <Route path="/editProfile" element={<EditProfile />} />
        </Routes>
      </Router>
    </MainContext.Provider>
  );
}

export default App;
