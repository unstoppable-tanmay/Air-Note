import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import "./App.css";  

import ErrorBoundary from "./components/ErrorBoundary";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";

// Icons
import { FaStickyNote, FaCloudDownloadAlt, FaGripHorizontal, FaWhmcs, FaSignOutAlt, FaUserAlt, FaSignInAlt } from "react-icons/fa";


function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [islist, setIslist] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
      } catch (e) {
        if (e !== "No current user") {
          onError(e);
        }
      }
      setIsAuthenticating(false);
    }
    onLoad();
  }, []);
  

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    nav("/");
  }
  async function handlelists() {
    islist ? setIslist(false) : setIslist(true);
    console.log(islist);
  }
  function loadnotes(){
    nav("/");
    window.location.reload(false);
  }
  
  return (
    !isAuthenticating && (
      <div className="App">
      {/* Nav Bar */}
      <div className="header">
        <div className="left">
          <div className="logo" to="/">
            <FaStickyNote />
            <div className="ltext">AirNote</div>
          </div>
        </div>
        <div className="right">
          <div className="righticons">
            {isAuthenticated ? (
                <>
                  <div className="refresh" onClick={loadnotes}><FaCloudDownloadAlt /></div>
                  <div className="viewchange" onClick={handlelists}><FaGripHorizontal /></div>
                  <LinkContainer to="/settings">
                    <div className="settings"><FaWhmcs /></div>
                  </LinkContainer>
                    <div className="account" onClick={handleLogout}><FaSignOutAlt /></div>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <div className="loginpage"><FaUserAlt /><div className="loginpagetext">Signup</div></div>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <div className="loginpage"><FaSignInAlt /><div className="loginpagetext">Login</div></div>
                  </LinkContainer>
                </>
              )}
          </div>
        </div>
      </div>
       
      <ErrorBoundary>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, islist }}>
          <Routes />
        </AppContext.Provider>
      </ErrorBoundary>
      </div>
    )
  );
}

export default App;