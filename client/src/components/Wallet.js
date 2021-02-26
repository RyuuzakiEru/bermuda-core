import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: '#12151c',
    },
    whiteBg: {
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column'
    },
}));


const WalletDialog = (props) => {

    const providers = ['Metamask', 'Binance Chain Wallet'];

    const { onClose, selectedValue, open } = props;

    const classes = useStyles();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog PaperProps={{style: {backgroundColor: '#12151c', color: 'white'}}} onClose={handleClose} open={open} >
            <DialogTitle id="simple-dialog-title">Select Your Wallet</DialogTitle>
            <List className={classes.whiteBg}>
                {providers.map((provider) => (
                    <ListItem button onClick={() => handleListItemClick(provider)} key={provider}>
                        <ListItemText primary={provider} />
                    </ListItem>
                ))}
            </List>
        </Dialog >
    );
}

export default WalletDialog;