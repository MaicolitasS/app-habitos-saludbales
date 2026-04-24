import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Debug: verificar que las variables cargan correctamente
console.log('=== Firebase Config ===');
console.log('apiKey:', firebaseConfig.apiKey ? '✅ cargada' : '❌ VACÍA');
console.log('authDomain:', firebaseConfig.authDomain ? '✅ cargada' : '❌ VACÍA');
console.log('projectId:', firebaseConfig.projectId ? '✅ cargada' : '❌ VACÍA');
console.log('appId:', firebaseConfig.appId ? '✅ cargada' : '❌ VACÍA');
console.log('======================');

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { 
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};
