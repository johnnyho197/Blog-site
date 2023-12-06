// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithPopup, getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtlRmq6pFHzr9EZYUMfAmGB_GPcCN4Vnw",
  authDomain: "blog-site-197ad.firebaseapp.com",
  projectId: "blog-site-197ad",
  storageBucket: "blog-site-197ad.appspot.com",
  messagingSenderId: "982427597003",
  appId: "1:982427597003:web:0489627c80af2b5415834e"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account",
});

export const singInWithGooglePopup = () => signInWithPopup(auth, provider);

export const signInAuthUserWithEmailAndPassword = async (email, password) =>{
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
}

export const createAuthUserWithEmailAndPassword = async (email, password) =>{
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
}

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {

    if(!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);
    if (!userSnapshot.exists()){
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef,{
                displayName,
                email,
                createdAt,
                ...additionalInformation,
            })
        } catch (err){
            console.log('error creating the user', err.message);
        }
    }

    return userDocRef;
}
