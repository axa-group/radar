import Footer from './Footer';
import React, { useContext } from 'react';
import { ConfigurationContext } from '../../Configuration';
import './Footer.scss';


const FooterAppContainer = () => {
    const configuration = useContext(ConfigurationContext);
    return <Footer configuration={configuration} />;
};

export default FooterAppContainer;
