import React, { useState, useEffect, createContext } from "react";
// import Navbar from "react-bootstrap/Navbar";
// import "./App.css";
import Routes from "./Routes";
// import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";
import "./App2.css";  

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList, faSignInAlt, faRedo, faUserPlus, faCog, faGripHorizontal, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [islist, setIslist] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    onLoad();
  }, []);
  
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

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);

    nav("/login");
  }
  async function handlelists() {
    islist ? setIslist(false) : setIslist(true);
    console.log(islist);
  }
  function loadnotes(){
    nav("/");
  }

  return (
    !isAuthenticating && (
      <div className="App">
      
        {/* <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              Air Note
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <Nav.Link>Settings</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar> */}

        {/* Routes Starts */}


                
    <>
      <div className="header">
        <div className="left">
          <div className="logo" to="/">
            <FontAwesomeIcon icon={ faClipboardList }/>
            <div className="ltext">AirNote</div>
          </div>
        </div>
        <div className="right">
          <div className="righticons">
            {isAuthenticated ? (
                <>
                  <div className="refresh" onClick={loadnotes}><FontAwesomeIcon icon={ faRedo }/></div>
                  <div className="viewchange" onClick={handlelists}><FontAwesomeIcon icon={ faGripHorizontal }/></div>
                  <LinkContainer to="/settings">
                    <div className="settings"><FontAwesomeIcon icon={ faCog }/></div>
                  </LinkContainer>
                    <div className="account" onClick={handleLogout}><FontAwesomeIcon icon={ faSignOutAlt }/></div>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <div className="loginpage"><FontAwesomeIcon icon={ faUserPlus }/><div className="loginpagetext">Signup</div></div>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <div className="loginpage"><FontAwesomeIcon icon={ faSignInAlt }/><div className="loginpagetext">Login</div></div>
                  </LinkContainer>
                </>
              )}
          </div>
        </div>
      </div>
    </>

       
        <AppContext.Provider value={{ isAuthenticated , islist, userHasAuthenticated }}>
            <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;