import { Button } from '@mui/material'
import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import { storage, db } from "./firebase"
import './assets/css/ImageUpload.css'

function ImageUpload({ username }) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState("")
    const [msg, setMsg] = useState("")

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (err) => {
                // Error function
                console.log(err)
            },
            () => {
                // Complete function...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0)
                        setCaption("")
                        setImage(null)
                        setMsg("Image Uploaded")
                    })
            }
        )
    }

    return (
        <div className="imageUpload">
            <p>{msg}</p>
            <progress value={progress} max="100" className="imageUpload_progress"/>
            <input 
                type="text" 
                placeholder="Enter a caption..." 
                onChange={e => setCaption(e.target.value)} 
                value={caption}
                className="imageUpload_input"
            />
            <input type="file" onChange={handleChange} className="imageUpload_file"/>
            <Button className="imageUpload_button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
