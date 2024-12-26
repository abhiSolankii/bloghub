import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-hub-f5959.firebaseapp.com",
  projectId: "blog-hub-f5959",
  storageBucket: "blog-hub-f5959.appspot.com",
  messagingSenderId: "454273519202",
  appId: "1:454273519202:web:18415708b02c18fee80b3b",
};

export const app = initializeApp(firebaseConfig);
