import React, { useState } from 'react';
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
  const [provider, setProvider] = useState(null);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <TopBar setProvider={setProvider} />
      <Container component="main" className={classes.main} maxWidth="xl">

        <Grid container direction="row"
  justify="space-around"
  alignItems="stretch" >
          <Grid item xs={12} sm={12} md={12}  lg={6} xl={6}>
            <Deposit setInfo={setInfo} provider={provider} />
          </Grid>
          <Grid item xs={12} sm={12} md={12}  lg={6} xl={6}><Withdraw  provider={provider} /></Grid>

        </Grid>
      </Container>
    </div >
  );
}

export default App;