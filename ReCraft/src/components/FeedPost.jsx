import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/FeedPost.css'
import { useState } from 'react'

import heartPhoto from '../assets/heart.png'
import commPhoto from '../assets/chat.png'
import sendPhoto from '../assets/up-arrow.png'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';



function FeedPost(){
    const [likeAmt, setLikeAmt] = useState(0);
    const [show, setShow] = useState(false);
    const [showInv, setShowInv] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseInv = () => setShowInv(false);
    const handleShowInv = () => setShowInv(true);

    const [comms,setComms]= useState([{username: "User393029", com: "Super Cool Craft Idea! I can't wait to try this out with my friends!" }])


    function likeButton(){
    if(likeAmt>=1){setLikeAmt((likeAmt=> likeAmt - 1))}
    else {setLikeAmt((likeAmt=> likeAmt + 1))}
  }

  function openComm() {
  document.getElementById("SideComment").style.width = "20%";
  document.getElementById("SideComment").style.display = "block";
  document.getElementById("MainPost-Box").style.paddingRight = "10%";
}

function closeComm() {
  document.getElementById("SideComment").style.width = "0px";
  document.getElementById("MainPost-Box").style.marginRight = "0px";
}

function addTask() {
    let a = document.getElementById("comment-Input");
    let b = "None";

     if(a.value == "" || a.value == null) {
        handleShowInv()
        openComm()
        return
        }
    
    setComms([...comms, {username: 'ActiveUser', com: a.value}])

    document.getElementById("comment-Input").value = ""
    document.getElementById("comment-Input").placeholder = "Comment Something Kind"
    handleShow()
    openComm()
}

    return(
        <>
        
       
        <div id="MainPost-Box">

            <img src='https://www.rowsignsandgraphics.com/wp-content/uploads/2021/08/Inset_Black_Square.jpg' alt='Black Square' style={{width: "50%"}} id='MM-Img'/>


            <div id="MM-Content">
               
                    
                    <button style={{background: "transparent", maxWidth: "15%"}}><img src={heartPhoto} style={{width: "100%", borderRadius:"20%"}} onClick={likeButton}/> </button><p style={{fontSize: "30px", paddingRight: "3%", paddingLeft: "2%"}}>{likeAmt}</p>
                    

                   
                    <InputGroup id="commentGroup"> 
                    <div style={{background: "transparent", maxWidth: "15%"}} >
                        <button onClick={openComm} style={{background: "transparent", maxWidth: "100%"}}><img src={commPhoto} style={{width: "100%"}}/></button>
                    </div>

                    <Form.Control placeholder='Comment Something Kind' id="comment-Input"></Form.Control>
                    
                    <button style={{background: "transparent", maxWidth: "15%"}} onClick={addTask}>
                        <img src={sendPhoto} style={{width: "100%"}}/>
                    </button>
                    </InputGroup>
            </div>

             <div id="SideComment">
                        <h2>Comments</h2>
                        <p><b>User593020:</b>Super Cool Craft</p>
                        {comms.map((inf, ky) => <div>
                            <p key={ky}><b>{inf.username}:</b> {inf.com}</p>
                        </div>
                        )}
                        </div>
            
                 </div>
                 
      
       
        <Modal show={show} onHide={handleClose} centered>
                        <center><Modal.Title>Comment Submitted</Modal.Title></center>
                       <Modal.Footer><button onClick={handleClose}>Close</button></Modal.Footer>
                    </Modal>

        <Modal show={showInv} onHide={handleCloseInv} centered>
                        <center><Modal.Title>Invalid Input</Modal.Title></center>
                        <Modal.Body>Something wasn't quite right, try submitting your comment again.</Modal.Body>
                       <Modal.Footer><button onClick={handleCloseInv}>Close</button></Modal.Footer>
                    </Modal>
        </>
    )
    
}

export default FeedPost