import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../lib/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";
import { s3Upload } from "../lib/awsLib";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment, title } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setTitle(title);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);
  
  function validateForm() {
    return content.length > 0;
  }
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }
  async function handleSubmit(event) {
    let attachment;
  
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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
  
      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteNote();
      nav("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>


        <div className="new_note new_note_open update_note">
          <input type="text" name="Titel" className="new_note_open_titel" value={title}  placeholder="Titel" onChange={(e) => setTitle(e.target.value)}/>
          <textarea className="new_note_open_text update_textarea" placeholder="Take a note . . ." value={content} onChange={(e) => setContent(e.target.value)}></textarea>

          <div className="new_note_open_icons">
            <div className="new_note_open_icons_left">
              <div className="file">
                <Form.Group controlId="file">
                  {note.attachment && (
                    <p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={note.attachmentURL}
                      >
                        {formatFilename(note.attachment)}
                      </a>
                    </p>
                  )}
                  <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
              </div>
            </div>
            <div className="btn_grp">
              <div className="closebtn" onClick={handleSubmit} disabled={!validateForm()}>Update</div>
              <div className="closebtn" onClick={handleDelete}>Delete</div>
            </div>
          </div>
        </div>
        </Form>
      )}
    </div>
  );
}