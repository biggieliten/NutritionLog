npm i

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { db } from "../../firebaseConfig.js";
import { stylesIndex } from "../styles/styles";
import {
getFirestore,
collection,
addDoc,
doc,
setDoc,
serverTimestamp,
arrayUnion,
} from "firebase/firestore";

const docRef = doc(db, "users", "dailyGoal");

import { initializeApp } from "firebase/app";

// ... (Your Firebase initialization code) ...

interface User {
email: string;
dailyGoal: {
calories: number;
carbohydrates: number;
protein: number;
fat: number;
};
logs: {
date: string; //Or use Date object or Timestamp
calories: number;
carbohydrates: number;
protein: number;
fat: number;
}[];
}

async function addUser(user: User) {
try {
const usersCollectionRef = collection(db, "users");
const newDoc = await addDoc(usersCollectionRef, user);
console.log("User added with ID:", newDoc.id);
return newDoc.id; //return the generated id
} catch (error) {
console.error("Error adding user:", error);
throw error; //re-throw the error
}
}

// Example usage:
const newUser: User = {
email: "testuser@example.com",
dailyGoal: {
calories: 2500,
carbohydrates: 150,
protein: 200,
fat: 50,
},
logs: [
{
date: "2022-01-01",
calories: 2340,
carbohydrates: 152,
protein: 170,
fat: 30,
},
],
};

const addUsr = () => {
addUser(newUser)
.then((userId) => {
console.log("User ID:", userId);
})
.catch((error) => {
console.error("Error:", error);
});
};

// const [userData, setUserData] = useState() as any;
// const usersCollection = collection(db, "users");

// useEffect(() => {
// const fetchUsers = async () => {
// try {
// const querySnapshot = await getDocs(usersCollection); // Fetch documents

// querySnapshot.forEach((doc) => {
// console.log(doc.id, " => ", doc.data());
// });

// // const userList = querySnapshot.docs.map((doc) => ({
// // id: doc.id, // Get document ID
// // ...doc.data(), // Spread document data
// // }));

// // setUserData(userList);
// } catch (error) {
// console.error("Error fetching users:", error);
// } finally {
// // setLoading(false); // Stop loading
// }
// };

// fetchUsers();
// }, []);
// const getDB = () => {
// getDoc(docRef)
// .then((docSnap) => {
// if (docSnap.exists()) {
// console.log("Document data:", docSnap.data());
// setUserData(docSnap.data());
// } else {
// console.log("No such document!");
// }
// })
// .catch((error) => {
// console.error("Error getting document:", error);
// });
// };

// const data = userData;
// console.log(userData);
export default function test() {
return (
<ScrollView contentContainerStyle={stylesIndex.container}>
<Pressable onPress={() => addUsr()}>
<Text>Get db</Text>
</Pressable>
</ScrollView>
);
}
