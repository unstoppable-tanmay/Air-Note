import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import "./Login.css";
import { Link } from "react-router-dom";

import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  // Trigger Google login
  const signIng = async () =>
    await Auth.federatedSignIn({
      provider: "Google",
    });
  // Trigger Facebook login
  const signInfb = async () =>{
    await Auth.federatedSignIn({
      provider: "Facebook",
    });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit} className="loginbox">
        <div className="signinbtns">
          <FaGoogle className="signin_g_fb" onClick={signIng}/>
          <FaFacebookF className="signin_g_fb" onClick={signInfb} />
          <FaTwitter className="signin_g_fb" />
        </div>
        <Form.Group size="lg" controlId="email" className="login_email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password" className="login_pass">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block="true"
          size="lg"
          type="submit"
          isLoading={isLoading} className="login_submit"
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
        <Link to="/login/reset">Forgot password?</Link>
      </Form>
    </div>
  );
}

// 