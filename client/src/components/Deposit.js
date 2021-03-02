import React, { useState } from 'react';

import Web3 from 'web3'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

import InfoPanel from './InfoPanel';

import BermudaBNBAbi from '../contracts/BermudaBNBABI.json';
import BermudaBEP20Abi from '../contracts/BermudaBEP20ABI.json';
import BEP20Abi from '../contracts/IBEP20.json';
import addresses from '../contracts/addresses.json'

import { createDeposit, toHex } from '../util'


const ABI = {
    BNB: BermudaBNBAbi,
    USDT: BermudaBEP20Abi,
    token: BEP20Abi,
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(3),
    },
    whiteBg: {
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
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

const Deposit = ({ provider = null }) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        currency: 'BNB',
        amount: '0.1',
        note: undefined,
        status: undefined,
    });

    const [info, setInfo] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const handleDeposit = async () => {
        setInfo({})
        if (provider === null) return;
        const web3 = new Web3(provider);
        const networkVersion = provider.networkVersion || parseInt(provider.chainId);
        const selectedAddress = await provider.request({ method: 'eth_requestAccounts' });
        const { currency, amount } = state;
        const contractAddress = addresses[networkVersion][currency][amount];
        const deposit = createDeposit({});
        const note = toHex(deposit.preimage, 62)
        const noteString = `bermuda-${currency}-${amount}-${networkVersion}-${note}`
        const gasPrice = await provider.request({ method: 'eth_gasPrice', params: [], id: networkVersion }).then(parseInt) * 2;
        try {
            const contract = await new web3.eth.Contract(ABI[currency], contractAddress);
            if (currency === "BNB") {
                setInfo({
                    ...info,
                    status: "Creating Deposit",
                    message: "Confirm Transaction in your wallet",
                    note: noteString,
                })
                await contract.methods.deposit(toHex(deposit.commitment)).send({ value: web3.utils.toWei(amount, 'ether'), from: selectedAddress[0], gasPrice })
                
                setInfo({
                    ...info,
                    status: "Success!",
                    message: "Transaction mined!",
                    note: noteString
                })
            } else {
                const weiAmount = web3.utils.toWei(amount, 'ether');

                const tokenContract = await new web3.eth.Contract(ABI.token, addresses[networkVersion]["tokens"][currency]);
                const allowance = await tokenContract.methods.allowance(selectedAddress, contractAddress).call({ from: selectedAddress });

                if (allowance < weiAmount) {
                    await tokenContract.methods.approve(contractAddress, weiAmount).send({ from: selectedAddress });
                }

                await contract.methods.deposit(toHex(deposit.commitment)).send({ from: selectedAddress })
                setInfo({
                    ...info,
                    status: "Creating Deposit",
                    message: "Transaction Confirmed!",
                    note: noteString,
                })

            }


        } catch (e) {
            console.error(e)
            setInfo({
                ...info,
                status: "Error",
                message: "there was an error",
                note: e.message
            })
        }
    }

    const networkVersion = provider && (provider.networkVersion || parseInt(provider.chainId));
    return (
        <>
            <div className={classes.whiteBg}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Currency</InputLabel>
                    <Select
                        native
                        value={state.currency}
                        onChange={handleChange}
                        label="Currency"
                        inputProps={{
                            name: 'currency'
                        }}
                        disabled={!(addresses[networkVersion] && addresses[networkVersion]['BNB'])}
                    >
                        <option aria-label="None" value="" />
                        <option value={'BNB'}>BNB</option>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Amount</InputLabel>
                    <Select
                        native
                        value={state.amount}
                        onChange={handleChange}
                        label="Amount"
                        inputProps={{
                            name: 'amount'
                        }}
                    >
                        <option aria-label="None" value="" />
                        {addresses[networkVersion] && Object.keys(addresses[networkVersion]['BNB']).map(amount =>
                            <option key={amount} value={amount}>{amount}</option>
                        )}

                    </Select>
                </FormControl>

                <Button disabled={!provider} variant="contained" size="large" className={classes.button} onClick={handleDeposit}>
                    {provider ? "DEPOSIT" : "CONNECT WALLET"}
                </Button>

            </div>
            <InfoPanel info={info} />
        </>

    )
}

export default Deposit;