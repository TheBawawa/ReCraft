import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/FeedPost.css'
import { useState } from 'react'

import heartPhoto from '../assets/heart.png'
import commPhoto from '../assets/chat.png'
import sendPhoto from '../assets/up-arrow.png'


{/** BootStrap Potential Imports: Button Group, Cards, Container, Row, Col */}
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';



function FeedPost({title, mediaDt,mediaTp, usName, likeCount, capT}){
    const getYouTubeEmbedUrl = (url) => {
              if (!url) return null;
              const watch = url.match(/[?&]v=([^&]+)/);
              if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
              const short = url.match(/youtu\.be\/([^?]+)/);
              if (short) return `https://www.youtube.com/embed/${short[1]}`;
              return url.includes("/embed/") ? url : null;
            };

    const [likeAmt, setLikeAmt] = useState(likeCount);

    function likeButton(){
    if(likeAmt>=likeCount){setLikeAmt((likeAmt=> likeAmt - 1))}
    else {setLikeAmt((likeAmt=> likeAmt + 1))}
  }

    return(
        <>
         <div id="MainPost-Box">
            {/*TITLE*/}
            <div style={{margin: "auto", textAlign: "center", paddingTop: "2%", paddingBottom: "1%"}}>
             <h3 >{title}</h3>
             <p>By: {usName}</p>
             </div>

             {/* MEDIA */}
             {mediaDt && (
                <>
                {mediaTp === "video/link" ? (
            <iframe
              width="80%"
              height="400"
              src={getYouTubeEmbedUrl(mediaDt)}
              style={{ borderRadius: "12px", display: "block", margin:"0 auto"}}
              allowFullScreen
            />
          ) : (
            <img
              src={mediaDt}
              alt="post"
              style={{ width: "70%", borderRadius: "12px", maxHeight: "500px", display: "block", margin:"0 auto", objectFit: "cover"}}
            />
          )}
        </>
    )}

    <div id="MM-Content">
        <button style={{background: "transparent", maxWidth: "7%"}}><img src={heartPhoto} style={{width: "100%", borderRadius:"20%"}} onClick={likeButton}/> </button><p style={{fontSize: "20px", paddingRight: "3%", paddingLeft: "2%", margin: "auto"}}>{likeAmt}</p>
        <InputGroup id="commentGroup"> 
        <Form.Control placeholder='Comment Something Kind' id="comment-Input"></Form.Control>
        <button style={{background: "transparent", maxWidth: "7%", paddingRight: "2%"}} >
                        <img src={sendPhoto} style={{width: "100%"}}/>
                    </button>
                </InputGroup>
    </div>

             <p style={{marginLeft: "5%", marginRight: "5%"}}>
                {capT}
             </p>
         </div>
        </>
    )
    
}

export default FeedPost