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
    position: 'fixed',
    width: '100%',
    bottom: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  note: {
    overflowWrap: 'anywhere'
  }
}));


const App = () => {

  const [info, setInfo] = useState({ status: null, note: null })
  const [provider, setProvider] = useState(null);

  const classes = useStyles();

  return (
    <div className={classes.root}>

      <TopBar provider={provider} setProvider={setProvider} />
      <Container component="main" className={classes.main} maxWidth="xl">

        <Grid container direction="row"
          justify="space-around"
          alignItems="stretch" >
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <Deposit setInfo={setInfo} provider={provider} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}><Withdraw provider={provider} /></Grid>

        </Grid>
      </Container>
      <div className={classes.footer}>
        <Typography align="center" variant="body2">
          © Bermuda Triangle. All rights reserved.
         </Typography>
      </div>
    </div >
  );
}

export default App;