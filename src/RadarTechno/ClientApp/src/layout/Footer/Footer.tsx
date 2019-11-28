import { Footer } from "@axa-fr/react-toolkit-all";
import logo from "@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg";
import React from "react";
import "./Footer.scss";

const data = require("../../version.json");

const FooterApp = () => {
  return (
    <Footer icon={logo}>
      @ 2019 AXA Tous droits réservés - {data.version}
    </Footer>
  );
};

export default FooterApp;
