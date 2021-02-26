import React from 'react';

import Web3 from 'web3'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

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

const Deposit = ({ setInfo, provider = null }) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        currency: 'BNB',
        amount: '0.1',
        note: undefined,
        status: undefined,
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const handleDeposit = async () => {

        if (provider === null) return;
        const web3 = new Web3(provider);
        const { chainId } = provider;
        const networkVersion = parseInt(chainId)
        const selectedAddress = await provider.request({ method: 'eth_requestAccounts' });
        const { currency, amount } = state;
        console.log(selectedAddress)
        const contractAddress = addresses[networkVersion][currency][amount];
        const deposit = createDeposit({});
        const note = toHex(deposit.preimage, 62)
        const noteString = `bermuda-${currency}-${amount}-${networkVersion}-${note}`
        const gasPrice = await provider.request({ method: 'eth_gasPrice', params: [], id: '0x61' }).then(parseInt) * 2;
        try {
            const contract = await new web3.eth.Contract(ABI[currency], contractAddress);
            setState({
                ...state,
                note: 'Confirm your transaction and wait for it to be mined....',
            });
            if (currency === "BNB") {
                setState({ ...state, note: noteString, status: 'Pending...' });
                await contract.methods.deposit(toHex(deposit.commitment)).send({ value: web3.utils.toWei(amount, 'ether'), from: selectedAddress[0], gasPrice })
                setState({
                    ...state,
                    note: noteString,
                });
                setInfo({ note: noteString, status: 'Transaction Confirmed!' });

            } else {
                const weiAmount = web3.utils.toWei(amount, 'ether');

                const tokenContract = await new web3.eth.Contract(ABI.token, addresses[networkVersion]["tokens"][currency]);
                const allowance = await tokenContract.methods.allowance(selectedAddress, contractAddress).call({ from: selectedAddress });

                if (allowance < weiAmount) {
                    await tokenContract.methods.approve(contractAddress, weiAmount).send({ from: selectedAddress });
                    setInfo({ note: noteString, status: 'Approve and allow your token....' });
                    setState({
                        ...state,
                        note: 'Approve and allow your token....',
                    });
                }
                setInfo({ note: noteString, status: 'Pending...' });
                await contract.methods.deposit(toHex(deposit.commitment)).send({ from: selectedAddress })
                setState({
                    ...state,
                    note: noteString,
                });
                setInfo({ note: noteString, status: 'Transaction Confirmed!' });
                console.log(noteString);
            }


        } catch (e) {
            console.error(e)
        }
    }


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
                    >
                        <option aria-label="None" value="" />
                        <option value={'BNB'}>BNB</option>
                        <option value={'USDT'}>USDT</option>
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
                        <option value={'0.1'}>0.1</option>
                        <option value={'1.0'}>1.0</option>
                    </Select>
                </FormControl>

                <Button variant="contained" size="large" className={classes.button} onClick={handleDeposit}>
                    DEPOSIT
            </Button>

            </div>
            {state.note &&
                <div className={classes.whiteBg}>


                </div>
            }
        </>

    )
}

export default Deposit;