import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_API_KEY } from 'react-native-dotenv';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'project-fridge-9721e.firebaseapp.com',
  databaseURL:
    'https://project-fridge-9721e-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'project-fridge-9721e',
  storageBucket: 'project-fridge-9721e.appspot.com',
  messagingSenderId: '543443440603',
  appId: '1:543443440603:web:2a7ebb7993249a8c618dfe',
  measurementId: 'G-TY0RDRH662',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
