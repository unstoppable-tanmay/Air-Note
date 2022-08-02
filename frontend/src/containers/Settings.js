import React from "react";
// import { API } from "aws-amplify";
// import { useNavigate } from "react-router-dom";
// import { onError } from "../lib/errorLib";
// import config from "../config";

import "./Settings.css"
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default function Settings() {
  // const nav = useNavigate();
  // const [isLoading, setIsLoading] = useState(false);

  // function billUser(details) {
  //   return API.post("notes", "/billing", {
  //     body: details,
  //   });
  // }

  return (
    <div className="Settings">
      <div className="settings_container">
        <div className="settings_heading">Settings</div>
        <LinkContainer to="/settings/email">
          <LoaderButton block bsSize="large">
            Change Email
          </LoaderButton>
        </LinkContainer>
        <LinkContainer to="/settings/password">
          <LoaderButton block bsSize="large">
            Change Password
          </LoaderButton>
        </LinkContainer>
      </div>
    </div>
  );
}