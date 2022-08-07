import React, { useState, useEffect, useRef } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import config from "../config";

import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { s3Upload } from "../lib/awsLib";

// css
import "./NewNote.css";
import "./Home.css";

// Icons
import { FaRegTrashAlt, FaRegStar, FaImages, FaStar } from "react-icons/fa";

// Images
import "./back1.png"


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [iscreatenote, setiscreatenote] = useState(false);
  const { islist, isAuthenticated } = useAppContext();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const file = useRef(null);
  const [isarchive, setisarchive] = useState(false);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  // useEffect(()=>{
  //   window.addEventListener('click', function(e){   
  //     if (document.querySelector(".new_note").contains(e.target)){
  //       // Clicked in box
  //       setiscreatenote(true);
  //     } else{
  //       // Clicked outside the box
  //       setiscreatenote(false);
  //     }
  //   });
  // })

  function validateClose(){
    setiscreatenote(false);
  }
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  async function handleSubmit() {
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    // setIsLoading(true);
    if(content.length > 0){
      console.log(content.length > 0);
      try {
        const attachment = file.current ? await s3Upload(file.current) : null;
        await createNote({ content, attachment, isarchive, title });
        setiscreatenote(false);
        onLoad();
      } catch (e) {
        onError(e);
        // setIsLoading(false);
      }
    }
    else{
      setiscreatenote(true);
      alert("Please Fill the Feilds");
    }
  }
  
  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  function loadNotes() {
    return API.get("notes", "/notes");
  }
  async function onLoad() {
    if (!isAuthenticated) {
      return;
    }
    try {
      const notes = await loadNotes();
      setNotes(notes);
    } catch (e) {
      onError(e);
    }
    setIsLoading(false);
  }
  async function handleDelete(event,id) {
    function deleteNote(id) {
      return API.del("notes", `/notes/${id}`);
    }
    event.preventDefault(); 
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteNote(id);
      onLoad();
    } catch (e) {
      onError(e);
    }
  }
  function expand_note(){
    var s_height = document.querySelector('.new_note_open_text').scrollHeight;
    document.querySelector('.new_note_open_text').setAttribute('style','height:'+s_height+'px');    
    console.log(s_height)
  }

  function renderNotesList(notes) {
    return (
      <>
      <div className="notepage">
        <LinkContainer to="" >
          {iscreatenote? (
              <div className="new_note new_note_open">
                <input type="text" name="Titel" className="new_note_open_titel"  placeholder="Titel" onChange={(e) => setTitle(e.target.value)}/>
                <textarea className="new_note_open_text" placeholder="Take a note . . ." onInput={expand_note} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                <div className="new_note_open_icons">
                  <div className="new_note_open_icons_left">
                    <div className="file_input">
                      <label htmlFor="file_input_f"><FaImages /></label>
                      <input type="file" name="" id="file_input_f" onChange={handleFileChange} />
                    </div>
                    <div className="file_check">
                      <div onClick={()=>{setisarchive(!isarchive)}}>{isarchive?<FaStar />:<FaRegStar />}</div>
                    </div>
                  </div>
                  <div className="btn_grp">
                    <div className="closebtn" onClick={handleSubmit}>Create</div>
                    <div className="closebtn" onClick={validateClose}>Close</div>
                  </div>
                </div>
              </div>
          ):(
            <div action className="new_note">
              <span className="ml-2 font-weight-normal new_note_titel">Take a note . . .</span>
            </div>
          )
          } 
        </LinkContainer>
        <div className={islist?"notesbox_list":"notesbox"}>
            {notes.map(({ noteId, content, createdAt, title }) => (
              <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                <div action className={islist?"notesdisplay_list":"notesdisplay"}>
                  <div className="font-weight-normal">
                    {title}
                  </div>
                  <span className="font-weight-bold">
                    {content.trim().split("\n")[0]}
                  </span>
                  <br />
                  <span className="text-muted date_notes">
                    Created: {new Date(createdAt).toLocaleString()}
                  </span>
                  <span className="delete_btn_onnote">
                    <FaRegStar onClick={event => handleDelete(event, noteId)} className="note_in_btns"/>
                    <FaRegTrashAlt  onClick={event => handleDelete(event, noteId)} className="note_in_btns"/>
                  </span>
                </div>
              </LinkContainer>
            ))}
        </div>
      </div>
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1 className="Home_Heading">Air Note</h1>
        <p className="text-muted home_des_font">A simple note taking app</p>
        <div className="imgnote"></div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}

