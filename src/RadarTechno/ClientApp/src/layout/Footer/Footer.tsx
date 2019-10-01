import { Footer } from "@axa-fr/react-toolkit-all";
import logo from "@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg";
import React from "react";
import "./Footer.scss";

const FooterApp = ({ configuration }) => (
  <Footer
    icon={logo}
    copyright={`@2019 AXA All rights reserved - v${
      configuration.loading ? "loading..." : configuration.version
    }`}
  />
);

export default FooterApp;
