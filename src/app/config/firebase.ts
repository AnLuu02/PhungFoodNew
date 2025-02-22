import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyAaK79Ik6yu_zUtRLLHLWtuBTsvQtF8yr8',
  authDomain: 'apiservlet.firebaseapp.com',
  projectId: 'apiservlet',
  storageBucket: 'apiservlet.appspot.com',
  messagingSenderId: '245567150762',
  appId: '1:245567150762:web:17f5d23f1f93cf0ad4ced3',
  measurementId: 'G-3JZBFFBXK7'
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
