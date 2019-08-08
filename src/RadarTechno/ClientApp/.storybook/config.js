import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';

import '@axa-fr/react-toolkit-all/dist/style/bootstrap/grid.css';
import '@axa-fr/react-toolkit-all/dist/style/bootstrap/reboot.css';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import '@axa-fr/react-toolkit-core/dist/assets/scss/core.scss';
import '@axa-fr/react-toolkit-core/src/common/scss/_custom-af.scss';

const req = requireContext('../src', true, /\.stories\.tsx$/);

configure(() => req.keys().forEach(filename => req(filename)), module);
