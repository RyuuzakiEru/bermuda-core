import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TopBar from './components/TopBar'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import { Container, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  footer: {
    margin: "auto",
    backgroundColor: '#12151c',
    borderColor: '#fff',
    color: '#fff',
    maxWidth: "70%",
    paddingY: theme.spacing(2),
    paddingX: theme.spacing(3),
  },
  note: {
    overflowWrap: 'anywhere'
  }
}));



const App = () => {

  const [info, setInfo] = useState({status:null, note: null})

  useEffect(() => {
    async function getWeb3() {
      if (window.ethereum) {
        await window.ethereum.enable()
      }
    }
    getWeb3()
  }, []);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <TopBar />
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="xl">

        <Grid container direction="row"
  justify="space-around"
  alignItems="stretch" >
          <Grid item xs={12} sm={12} md={12}  lg={6} xl={6}>
            <Deposit setInfo={setInfo} />
          </Grid>
          <Grid item xs={12} sm={12} md={12}  lg={6} xl={6}><Withdraw /></Grid>

        </Grid>
        {info.note && <Container className={classes.footer} >
          <Typography variant="body1">
            Your note:
          </Typography>
          <Typography align="center" variant="subtitle2" className={classes.note}>
            {info.note}
          </Typography>
        </Container>}
        {info.status && <Container className={classes.footer} >
          <Typography variant="body1">
            Status:
          </Typography>
          <Typography align="center" variant="subtitle2" className={classes.note}>
            {info.status}
          </Typography>
        </Container>}
      </Container>
    </div >
  );
}

export default App;