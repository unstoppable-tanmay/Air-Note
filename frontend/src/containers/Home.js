import React, { useState, useEffect, useRef } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
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
import { FaRegTrashAlt, FaRegStar } from "react-icons/fa";

// Images
import "./back1.png"


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [iscreatenote, setiscreatenote] = useState(false);
  const { islist, isAuthenticated } = useAppContext();

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
  
  function loadNotes() {
    return API.get("notes", "/notes");
  }
  function createNotepage(){
    iscreatenote?setiscreatenote(false): setiscreatenote(true);
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

  function NewNote() {
    const file = useRef(null);
    const [content, setContent] = useState("");
    const [isarchive, setisarchive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const nav = useNavigate();
  
    function validateForm() {
      return content.length > 0;
    }
    function validateClose(){
      setiscreatenote(false);
    }

    function handleFileChange(event) {
      file.current = event.target.files[0];
    }
  
    async function handleSubmit(event) {
      event.preventDefault();
      if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
        alert(
          `Please pick a file smaller than ${
            config.MAX_ATTACHMENT_SIZE / 1000000
          } MB.`
        );
        return;
      }
    
      setIsLoading(true);
    
      try {
        const attachment = file.current ? await s3Upload(file.current) : null;
    
        await createNote({ content, attachment, isarchive });
        setiscreatenote(false);
        onLoad();
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }
    
    function createNote(note) {
      return API.post("notes", "/notes", {
        body: note,
      });
    }

    function expand_note(){
      var s_height = document.querySelector('.new_note_onpage').scrollHeight;
      document.querySelector('.new_note_onpage').setAttribute('style','height:'+s_height+'px');    
      console.log(s_height)
    }

    return (
      <div>
        <Form onSubmit={handleSubmit}  className="NewNoteonpage">
              <textarea className="new_note_onpage" placeholder="Take a note . . ." onInput={expand_note} value={content} onChange={(e) => setContent(e.target.value)}>
                <input type="file" name="file_size" className="new_note_onpage" />
              </textarea>
            <Form.Group controlId="file">
              <Form.Label>Attachment</Form.Label>
              <Form.Control onChange={handleFileChange} type="file" />
            </Form.Group>
            <Form.Check 
              type="switch"
              id="custom-switch"
              label="Check this switch"
              onChange={()=>{setisarchive(true)}}
            />
            <div className="newnote_pagebtns">
              <LoaderButton
                block
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isLoading}
                disabled={!validateForm()}
              >
                Create
              </LoaderButton>

              <LoaderButton
                block
                size="lg"
                variant="danger"
                onClick={validateClose}
              >
                Close
              </LoaderButton>
          </div>
        </Form>
      </div>
    );
  }

  function renderNotesList(notes) {
    return (
      <>
      <div className="notepage">
        <LinkContainer to="" onClick={createNotepage}>
          {iscreatenote? (
              <NewNote/>
          ):(
            <div action className="new_note">
              <span className="ml-2 font-weight-normal">Take a note . . .</span>
            </div>
          )
          } 
        </LinkContainer>
        <div className={islist?"notesbox_list":"notesbox"}>
            {notes.map(({ noteId, content, createdAt }) => (
              <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                <div action className={islist?"notesdisplay_list":"notesdisplay"}>
                  <span className="font-weight-normal">
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