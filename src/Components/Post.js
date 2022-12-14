import React, {useState, useEffect } from 'react'
import "./assets/css/Post.css"
import { Avatar } from '@mui/material'
import { db } from './firebase'
import firebase from 'firebase/compat/app';

function Post({ postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => ({
                        id: doc.id,
                        comment: doc.data()
                    })))
                })
        }

        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment("")
    }

    return (
        <div className="post">
            <div className="post_header" >
                <Avatar 
                    className="post_avatar"
                    alt={username}
                    src=""
                />
                <h3>{username}</h3>
            </div>
            

            <img 
                className="post_image" 
                src={imageUrl} 
                alt=""/>

            <h4 className="post_text"><strong>{username} </strong> {caption}</h4>
        
            <div className="post_comments">
                {comments.map(({id, comment}) => (
                    <p key={id}>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post_commentBox">
                    <input
                        className="post_input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        disabled={!comment}
                        className="post_button"
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}
            

        </div>
  )
}

export default Post
