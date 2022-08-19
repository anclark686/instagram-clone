import React, { useState, useEffect } from 'react';
import Post from './Post';
import { auth, db } from './firebase'
import { Box, Button, Modal, Input } from '@mui/material'
import ImageUpload from './ImageUpload';
import Footer from './footer';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function App() {
  const [posts, setPosts] = useState([])
  
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [myPosts, setMyPosts] = useState(null)
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser)
        setUser(authUser)

      } else {
        // user has logged out...
        setUser(null)
      }
      return () => {
        // perform some cleanup actions 
        unsubscribe()
      }
    })
  }, [user, username])

  useEffect(() => {
    if (!myPosts || !user){
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })))
      })
    } else {
      db.collection('posts')
      .where("username", "==", user.displayName)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })))
      })
    }
    console.log(user)
  }, [myPosts])

  const signUp = (event) => {
    event.preventDefault()
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((err) => alert(err.message))

    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((err) => alert(err.message))

    setOpenSignIn(false)
  }

  const logout = (event) => {
    auth.signOut()
    setMyPosts(false)
  }

  return (
    <div className="App">

    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box sx={style}>
        <center>
          <div className="app_brand">
            <h1>Reyalygram</h1>
          </div>
        </center>
        <form className="app_signup">
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={signUp}>Sign Up</Button>
        </form>
      </Box>
    </Modal>

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
    >
      <Box sx={style}>
        <center>
          <div className="app_brand">
            <h1>Reyalygram</h1>
          </div>
        </center>
        <form className="app_signup">
          <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={signIn}>Sign In</Button>
        </form>
      </Box>
    </Modal>

    <Modal
      open={openUpload}
      onClose={() => setOpenUpload(false)}
    >
      <Box sx={style}>
        <center>
          <div className="app_brand">
            <h1>Reyalygram</h1>
          </div>
        </center>
          {user?.displayName ? <ImageUpload username={user.displayName}/> 
          : <p>Please Login to upload.</p>}
      </Box>
    </Modal>

      <div className="app_header">
        <div className="app_brand">
          <h1>Reyalygram</h1>
        </div>
        {user ? (
          <div className="app_loggedInContainer">
            {!myPosts ? 
            <Button onClick={() => setMyPosts(true)}>My Posts</Button>
          : <Button onClick={() => setMyPosts(false)}>All Posts</Button>}
            <Button onClick={() => setOpenUpload(true)}>New Post</Button>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        {
          posts.map(({id, post}) => (
            <Post 
              key={id} 
              postId={id} 
              user={user} 
              username={post.username} 
              caption={post.caption} 
              imageUrl={post.imageUrl}
            />
            
          ))
        }

      </div>
      <Footer />
    </div>
  );
}

export default App;