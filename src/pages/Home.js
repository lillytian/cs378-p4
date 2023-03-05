import React, { Component, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CurrentList from "../components/CurrentList";
import AddItems from "../components/AddItems";

// firebase imports
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  push,
  update,
} from "firebase/database";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8ODWnvB0HeoxJJoqG04Y9HE38fRrocPA",
  authDomain: "cs378-p4-7bae3.firebaseapp.com",
  databaseURL: "https://cs378-p4-7bae3-default-rtdb.firebaseio.com",
  projectId: "cs378-p4-7bae3",
  storageBucket: "cs378-p4-7bae3.appspot.com",
  messagingSenderId: "920481514578",
  appId: "1:920481514578:web:6a578fee60c7c1fa770b8b",
  measurementId: "G-EVZB2VDC3Y",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function Home() {
  // login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // grocery list states
  const [currGroceryItem, setCurrGroceryItem] = useState("");
  const [groceryList, setGroceryList] = useState([]);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        setIsLoggedIn(true);
      })
      .then(getGroceryItems)
      .catch((error) => {
        // alert(error.message + " in login");
      });
  };

  const handleSignUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        const { user } = userCred;
        const userURL = `users/${user.uid}/`;

        const userInfo = {
          uid: user.uid,
          email,
          groceries: [],
        };
        const newUserRef = child(ref(db), userURL);
        set(newUserRef, userInfo);
      })
      .then(handleLogin)
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleLogout = () => {
    signOut(auth);

    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const getGroceryItems = async () => {
    const userURL = `users/${auth.currentUser.uid}/groceries/`;

    await get(child(ref(db), userURL))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setGroceryList([...snapshot.val()]);
        } else {
          setGroceryList([]);
        }
      })
      .catch((error) => alert(error.message));
  };

  const handleAddGroceryItem = () => {
    const groceryURL = `users/${auth.currentUser.uid}/groceries/`;
    const newGroceryRef = child(ref(db), groceryURL);

    groceryList.push(currGroceryItem.toLowerCase());
    groceryList.sort();
    setGroceryList([...groceryList]);
    set(newGroceryRef, groceryList);

    setCurrGroceryItem("");
  };

  const login = (
    <div>
      <Row>
        <Col>
          <h1 id={"title"}>Grocery List App</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group className={"login-group"}>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className={"login-group"}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Row className={"login-btn-con"}>
              <Col>
                <Button
                  className={"btn-span"}
                  variant="success"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Col>
              <Col>
                <Button
                  className={"btn-span"}
                  variant="success"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );

  return (
    <Container className={"container"}>
      {isLoggedIn ? (
        <div>
          <Row className={"section"}>
            <Col>
              <h1>{`Hi, ${email.substring(0, email.indexOf("@"))}!`}</h1>
            </Col>
          </Row>
          <Row className={"section"}>
            <Col>
              <CurrentList items={groceryList} />
            </Col>
          </Row>
          <Row className={"section"}>
            <Col>
              <AddItems
                value={currGroceryItem}
                onChange={(e) => setCurrGroceryItem(e.target.value)}
                onSubmit={handleAddGroceryItem}
              />
            </Col>
          </Row>
          <Row className={"section"}>
            <Col>
              <Button variant="success" onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        login
      )}
    </Container>
  );
}

export default Home;
