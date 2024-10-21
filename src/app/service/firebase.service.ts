import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app'; // Import Firebase initialization
import { getFirestore, Firestore, collection, addDoc, getDocs, query, onSnapshot } from 'firebase/firestore'; // Import Firestore methods
import { FirebaseApp } from 'firebase/app'; // FirebaseApp type

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp; // Holds the Firebase app instance
  private firestore: Firestore; // Holds the Firestore instance

  constructor() {
    // Your Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAEt3q7SM1rkMRHe-nljck4ATrACWMlMF4",
      authDomain: "seg3102-lab5-wiltley.firebaseapp.com",
      projectId: "seg3102-lab5-wiltley",
      storageBucket: "seg3102-lab5-wiltley.appspot.com",
      messagingSenderId: "1097013248837",
      appId: "1:1097013248837:web:aa0c91439e6aa17a1cf42c"
    };

    // Initialize Firebase and Firestore
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app); // Get the Firestore instance
  }

  async addDocument(collectionName: string, data: any) {
    try {
      const colRef = collection(this.firestore, collectionName); // Get the collection reference
      const docRef = await addDoc(colRef, data); // Add the document to the collection
      console.log(`Document written with ID: ${docRef.id}`);
      return docRef;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async getDocuments(collectionName: string) {
    try {
      const colRef = collection(this.firestore, collectionName); // Get the collection reference
      const q = query(colRef); // Query the collection
      const querySnapshot = await getDocs(q); // Fetch the documents
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return documents;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  }

  listenToCollection(collectionName: string, callback: (docs: any[]) => void) {
    const colRef = collection(this.firestore, collectionName); // Get the collection reference
    const q = query(colRef); // Query the collection
    onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(documents);
    }, (error) => {
      console.error("Error listening to collection: ", error);
    });
  }
}
