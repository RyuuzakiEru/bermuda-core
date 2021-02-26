import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Hidden from '@material-ui/core/Hidden';

import WalletDialog from './Wallet';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {

    flexGrow: 1,
    maxWidth: 30,
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
  },
  button: {
    marginRight: theme.spacing(1),
    margin: "auto",
    backgroundColor: '#12151c',
    borderColor: '#fff',
    color: '#fff',
    maxWidth: "70%",
    paddingY: theme.spacing(2),
    paddingX: theme.spacing(3),
  },
}));

const TopBar = ({ setProvider }) => {


  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const switchProvider = async provider => {
    switch (provider) {
      case "Metamask":
        await window.ethereum.enable();
        setProvider(window.ethereum)
        setSelectedProvider("Metamask")
        break;
      case "Binance Chain Wallet":
        await window.BinanceChain.enable();
        setProvider(window.BinanceChain);
        setSelectedProvider("Binance Chain Wallet")
        break;
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    switchProvider(value);
  };
  const classes = useStyles();

  return (<>
    <div className={classes.root}>
      <AppBar title="BERMUDA" position="static">
        <Toolbar >
          <img src="/bermuda_logo.png" alt="logo" className={classes.menuButton} edge="start" />
          <Hidden smDown>
            <Typography variant="h6" className={classes.title}>
              BERMUDA
          </Typography>
          </Hidden>

          <Button variant="contained" color="primary" size="large" className={classes.button} onClick={handleClickOpen}>
            Conect Wallet
          </Button>
        </Toolbar>
      </AppBar>
    </div>

    <WalletDialog selectedValue={selectedProvider} open={open} onClose={handleClose} /></>
  );
}

export default TopBar;