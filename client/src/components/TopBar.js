import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Hidden from '@material-ui/core/Hidden';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    maxWidth: 80,
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
  },
  button: {
    margin: "auto",
    backgroundColor: '#12151c',
    borderColor: '#fff',
    color: '#fff',
    maxWidth: "70%",
    paddingY: theme.spacing(2),
    paddingX: theme.spacing(3),
},
}));

const TopBar = props => {
  const classes = useStyles();

  const toggleWeb3 = async () => {

    await window.ethereum.enable()
  }

  return (
    <div className={classes.root}>
      <AppBar title="BERMUDA" position="static">
        <Toolbar >
          <img src="/bermuda_logo.png" alt="logo" className={classes.menuButton} edge="start" />
          <Hidden smDown>
            <Typography variant="h5" className={classes.title}>
              BERMUDA
          </Typography>
          </Hidden>

          <Button variant="outlined" className={classes.button} onClick={toggleWeb3}>
            Conect Wallet
          </Button>

        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopBar;