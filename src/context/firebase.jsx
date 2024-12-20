// Firebase imports
import { 
  initializeApp 
} from "firebase/app";
import {  
  getFirestore, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  serverTimestamp, 
  orderBy, 
  onSnapshot, 
  limit, 
  getDoc 
} from "firebase/firestore";
import { 
  useContext, 
  createContext, 
  useState, 
  useEffect 
} from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail 
} from "firebase/auth";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyB1xA_bQuoDmnMWF5wsHs2lL9m8T5uo0bQ",
  authDomain: "niu-gossip.firebaseapp.com",
  projectId: "niu-gossip",
  storageBucket: "niu-gossip.appspot.com",
  messagingSenderId: "801433210710",
  appId: "1:801433210710:web:7863f166297605f420d0f7",
  measurementId: "G-TT5097B7GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create Context
const FirebaseContext = createContext();

// Create Provider
export const FirebaseProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [renderKey, setRenderKey] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState([]);

  const forceRender = () => setRenderKey((prevKey) => prevKey + 1);

  // Auth
  const auth = getAuth();

  // Signing Up
  const signUpUser = async (email, password, user) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: user,
      });
      setLoggedInUser(user);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Sign In
  const handleSigningIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      user.displayName === null ? setLoggedInUser(user.email) : setLoggedInUser(user.displayName);
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Check if the user is Signed In
  const checkForUser = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email;
        setLoggedInUser(displayName);
        toast.success(`Welcome back, ${displayName}!`);
      } else {
        setLoggedInUser(null);
      }
    });
    return unsubscribe;
  };
  
  useEffect(() => {
    const unsubscribe = checkForUser();
    return () => unsubscribe(); // Cleanup listener
  }, []);
  

  // Sign Out
  const signingOut = async () => {
    try {
      await signOut(auth);
      setLoggedInUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  // persist auth
  // useEffect(() => {
  //   if (!loggedInUser){
  //     setLoggedInUser(localStorage.getItem("gossipUser"))
  //   }else{
  //     localStorage.setItem("gossipUser",loggedInUser)
  //   }
  // },[loggedInUser])

  // Forgot Password
  const sendPasswordResetEmail = async (email) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Handle Post Event
  const handlePostEvent = async (post, setPost) => {
    try {
      const postRef = collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post");

      await addDoc(postRef, {
        description: post,
        likes: 0,
        dislikes: 0,
        hide: false,
        likedBy: [],
        timestamp: serverTimestamp(),
      });
      setPost("");
      forceRender();
    } catch (err) {
      console.log("Error adding document", err);
    }
  };

  // Read Data
  const readData = async (setPost) => {
    
    const postRef = collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post");
    
    const q = query(postRef, where("hide", "==", false), orderBy("timestamp", "desc"));
    const postArray = [];
    
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((element) => {
      const postData = element.data();
      const postId = element.id;
      postArray.push({
        id: postId,
        ...postData,
      });
    });
    setPost(postArray);
  };

  // Like Button with User Restriction
  const handleLikeCount = async (likeCount, setLikeCount, p, user) => {
    
    const postRef = doc(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post", p.id);
    
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
    const likedBy = postData.likedBy || [];
    if (!likedBy.includes(user)) {
      await updateDoc(postRef, {
        likes: postData.likes + 1,
        likedBy: [...postData.likedBy, user],
      });
      setLikeCount(likeCount+1)
      toast.success("you liked the post")
    } else {
      toast.error("you already liked it")
      console.log("User already liked this post.");
    }
  };
  // handle dislike count
  const handleDislikeCount = async (dislikeCount, setDislikeCount, p, user) => {
  
    const postRef = doc(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post", p.id);
  
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
  
    const dislikedBy = postData.dislikedBy || []; // Check for existing "dislikedBy" array
  
    if (!dislikedBy.includes(user)) {
      await updateDoc(postRef, {
        dislikes: postData.dislikes + 1,
        dislikedBy: [...dislikedBy, user], // Add the user to "dislikedBy" array
      });
      setDislikeCount(dislikeCount + 1);
      toast.success("You disliked the post");
    } else {
      toast.error("You already disliked this post");
      console.log("User already disliked this post.");
    }
  };
  
  // Enforce Like-to-Dislike Ratio
  const enforceLikeDislikeRatio = async () => {
    const postRef = collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post");
    const querySnapshot = await getDocs(postRef);

    querySnapshot.forEach(async (doc) => {
      const post = doc.data();
      if (post.dislikes > 0 && post.likes / post.dislikes < 0.2) {
        await deleteDoc(doc.ref);
      }
    });
  };

  // Limit to the last 30 posts
  const limitPosts = async () => {
    const postRef = collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post");
    const q = query(postRef, orderBy("timestamp", "desc"), limit(30));
    const querySnapshot = await getDocs(q);

    const allPosts = [];
    querySnapshot.forEach((doc) => {
      allPosts.push({ id: doc.id, ...doc.data() });
    });

    // Delete posts not in the latest 30
    const allDocs = await getDocs(collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post"));
    const postIdsToKeep = new Set(allPosts.map((post) => post.id));
    allDocs.forEach(async (doc) => {
      if (!postIdsToKeep.has(doc.id)) {
        await deleteDoc(doc.ref);
      }
    });
  };

  // Message Sending
  const handleSendMessage = async (message) => {
    try {
      const messageRef = collection(db, 'chats');
      await addDoc(messageRef, {
        message: message,
        timestamp: serverTimestamp(),
        user: loggedInUser
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Message Receive
  const handleReceiveMessage = () => {
    const messageRef = collection(db, 'chats');
    const q = query(messageRef, orderBy("timestamp", "asc"));
    console.log(q);
    
    onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReceivedMessages(messages);
    });
  };

  //automatic msg deletion
  const deleteOldMessages = async () => {
    try {
      const messageRef = collection(db, 'chats');
      const q = query(messageRef, orderBy("timestamp", "asc")); 
      const snapshot = await getDocs(q);
  
      const totalMessages = snapshot.docs.length;
      const messagesToDelete = totalMessages - 50; 
      
      if (messagesToDelete > 0) {
        const deleteBatch = snapshot.docs.slice(0, messagesToDelete); 
        for (const message of deleteBatch) {
          await deleteDoc(doc(db, 'chats', message.id)); 
        }
        console.log(`${messagesToDelete} old messages deleted successfully.`);
      } else {
        console.log("No messages to delete.");
      }
    } catch (error) {
      console.error("Error deleting old messages:", error);
    }
  };
  
  useEffect(() => {
    const cleanUpMessages = async () => {
      await deleteOldMessages();
    };
    cleanUpMessages();
  }, []); // Dependency array to run only once on mount
  

  // Value to be passed
  const value = {
    handlePostEvent,
    readData,
    handleDislikeCount,
    handleLikeCount,
    signUpUser,
    setLoggedInUser,
    loggedInUser,
    signingOut,
    renderKey,
    handleSendMessage,
    receivedMessages,
    handleReceiveMessage,
    handleSigningIn,
    sendPasswordResetEmail
  };

  // Trigger clean-up functions on renderKey change
  useEffect(() => {
    limitPosts();
    enforceLikeDislikeRatio();
  }, [renderKey]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom Hook
export const useFirebase = () => useContext(FirebaseContext);
