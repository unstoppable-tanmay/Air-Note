import React, { useState } from 'react';
import { Auth } from "aws-amplify";
import LoaderButton from "./LoaderButton";

// function waitForInit() {
//   return new Promise((res, rej) => {
//     const hasFbLoaded = () => {
//       if (window.FB) {
//         res();
//       } else {
//         setTimeout(hasFbLoaded, 300);
//       }
//     };
//     hasFbLoaded();
//   });
// }

export default function FacebookButton(props){
  const [isLoading, setIsLoading] = useState(false);

  const statusChangeCallback = response => {
    if (response.status === "connected") {
      handleResponse(response.authResponse);
    } else {
      handleError(response);
    }
  };

  const checkLoginState = () => {
    window.FB.getLoginStatus(statusChangeCallback);
  };

  const handleClick = () => {
    window.FB.login(checkLoginState, {scope: "public_profile,email"});
    console.log("handelClick");
  };

  function handleError(error) {
    alert(error);
  }

  async function handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    this.setState({ isLoading: true });

    try {
      const response = await Auth.federatedSignIn(
        "facebook",
        { token, expires_at },
        user
      );
      setIsLoading(false);
      props.onLogin(response);
    } catch (e) {
      setIsLoading(false);
      handleError(e);
    }
  }

    return (
      <LoaderButton
        block
        bsSize="large"
        bsStyle="primary"
        className="FacebookButton"
        text="Login with Facebook"
        onClick={handleClick}
        disabled={isLoading}
      />
    );
}