import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#eeb607',
    },
    secondary: {
      main: '#f5f5f5',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#12151c',
    },
  },
});

export default theme;