import { Footer } from '@axa-fr/react-toolkit-all';
import React, { useContext } from 'react';
import './Footer.scss';
import { ConfigurationContext } from '../../Configuration';


const FooterAppContainer = () => {
    const configuration = useContext(ConfigurationContext)
    return <Footer configuration={configuration} />;
};

export default FooterAppContainer;
