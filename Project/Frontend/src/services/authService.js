import { auth, db, onAuthStateChanged } from "@/firebase";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { logoutUser, setLoading, setUser } from "@/redux/slices/authSlice";

// Sign Up with Email & Password
export const signUpWithEmail = async (userData, password) => {

    console.log(userData);
    console.log(password);

    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const uid = userCredential.user.uid;
    const userDoc = { ...userData, uid };

    await setDoc(doc(db, "users", uid), userDoc);
    return userDoc;
};


// Login with Email & Password
export const loginWithEmail = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    return getUserData(uid);
};

// Get User Data from Firestore
export const getUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User not found");
    }
    return userSnap.data();
};

// Logout function
export const logout = async () => {
    await signOut(auth);
};

// Reset Password
export const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

export const checkUserSession = (dispatch) => {
    dispatch(setLoading(true)); // Start loading
  
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snapshot = await getDoc(userRef);
  
          if (snapshot.exists()) {
            const userData = snapshot.data();
            dispatch(setUser(userData));
          } else {
            console.log("User data not found in Firestore");
            dispatch(logoutUser());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(logoutUser());
        }
      } else {
        dispatch(logoutUser());
      }
  
      dispatch(setLoading(false)); // Stop loading after authentication check
    });

  };

// Refresh Token
export const refreshToken = async () => {
    const user = auth.currentUser;
    if(user){
        const idToken = await user.getIdToken();
        localStorage.setItem('idToken', idToken);
        return idToken;
    }
    return null;
}

// Sign In with Google
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const uid = user.uid;

        // Check if user document exists in Firestore
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // User already exists, return their data
            return userSnap.data();
        } else {
            // New user, create their document in Firestore
            const userDoc = {
                uid: uid,
                name: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                photoURL: user.photoURL || "",
                provider: "google",
                createdAt: new Date().toISOString(),
            };

            await setDoc(userRef, userDoc);
            return userDoc;
        }
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};