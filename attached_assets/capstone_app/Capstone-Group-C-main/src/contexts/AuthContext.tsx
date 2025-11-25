import { User } from "@/stores/useUserStore";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "@react-native-firebase/auth";
import {
    collection,
    doc,
    getFirestore,
    setDoc,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { createContext, PropsWithChildren, useContext } from "react";

type SignupUser = Pick<
  User,
  "first_name" | "last_name" | "email" | "phone_number" | "dial_code"
>;

type SignupUserWithPicture = SignupUser & { profile_picture?: string | null };

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: SignupUser) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  async function signUp(
    email: string,
    password: string,
    data: SignupUserWithPicture
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      const user = userCredential.user;
      const db = getFirestore();
      const usersCollection = collection(db, "users");

      // Store the provided profile_picture value (local URI or null). Keep sign-up simple for now.
      await setDoc(doc(usersCollection, user.uid), {
        uid: user.uid,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number || null,
        dial_code: data.phone_number ? data.dial_code : null,
        profile_picture: data.profile_picture || null,
      });

      router.replace("/");
    } catch (e: any) {
      alert("Registration failed: " + e.message);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      // Save the user UID or token to session state
      // await getAndRegisterPushToken();
      router.replace("/"); // Lets go home!!!
    } catch (error: any) {
      throw new Error("Error signing in: " + error.message);
    }
  }

  async function signOutUser() {
    if (!getAuth().currentUser) {
      console.warn("Cannot log out if no user is logged in.");
      return;
    }

    try {
      // await unregisterPushToken();
      await signOut(getAuth());
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
