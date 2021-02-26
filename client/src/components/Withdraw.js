/*eslint no-undef: "off"*/
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

import Button from '@material-ui/core/Button';

import Web3 from 'web3'

import { buildGroth16 } from 'websnark'
import { parseNote, generateProof } from '../util'

import BermudaBNBAbi from '../contracts/BermudaBNBABI.json';
import BermudaBEP20Abi from '../contracts/BermudaBEP20ABI.json';
import BEP20Abi from '../contracts/IBEP20.json';

import addresses from '../contracts/addresses.json'


const ABI = {
    BNB: BermudaBNBAbi,
    USDT: BermudaBEP20Abi,
    token: BEP20Abi,
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(3),
        minWidth: 300,
    },
    margin: {
        margin: theme.spacing(2),
    },
    whiteBg: {
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        margin: "auto",
        backgroundColor: '#12151c',
        borderColor: '#fff',
        color: '#fff',
        maxWidth: "70%",
        paddingY: theme.spacing(2),
        paddingX: theme.spacing(3),
        marginTop: theme.spacing(2),
    },
}));

const WithdrawForm = ({provider = null}) => {
    const classes = useStyles();

    const [groth16, setGroth16] = useState(null)

    const [state, setState] = useState({
        receipt: '',
        address: ''
    })

    useEffect(() => {
        async function buildGroth() {
            let groth = await buildGroth16();
            setGroth16(groth)
        }

        buildGroth()
    }, [])

    const handleChange = (event) => {
        console.log(event.target.name)
        console.log(event.target.value)
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };


    const handleWithDraw = async (event) => {
        event.preventDefault();
        if (provider === null) return;
        const web3 = new Web3(provider);
        const { chainId } = provider;
        const networkVersion = parseInt(chainId)
        const selectedAddress = await provider.request({method: 'eth_requestAccounts'});
        const gasPrice = await provider.request({method: 'eth_gasPrice', params: [], id: '0x61'}).then(parseInt) * 2;
        try {
            
            const { currency, amount, netId, deposit } = parseNote(state.receipt);
            if(netId !== networkVersion) return;
            const contractAddress = addresses[netId][currency][amount];
            const contract = await new web3.eth.Contract(ABI[currency], contractAddress);
            const circuit = await fetch('/withdraw.json').then(res => res.json());
            const proving_key = await fetch('/withdraw_proving_key.bin').then(res => res.arrayBuffer())
            const { proof, args } = await generateProof({ contract, groth16, circuit, proving_key, deposit, recipient: state.address })

            const response = await contract.methods.withdraw(proof, ...args).send({ from: selectedAddress[0], gasPrice })
            console.log(response);

        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div
         className={classes.whiteBg}
            direction="column"
            justify="center"
        >
            <FormControl variant="outlined" className={classes.formControl}>


                <InputLabel htmlFor="receipt">Receipt</InputLabel>
                <Input
                    id="receipt"
                    value={state.receipt}
                    onChange={handleChange}
                    inputProps={{
                        name: 'receipt'
                    }}
                />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>



                <InputLabel htmlFor="component-helper">Address</InputLabel>
                <Input
                    fullWidth={true}
                    id="address"
                    value={state.address}
                    onChange={handleChange}
                    inputProps={{
                        name: 'address'
                    }}
                />

            </FormControl>
            <Button variant="contained" className={classes.button} size="large"  onClick={handleWithDraw} disabled={groth16 === null}>
                {groth16 === null? "Wait...": "WITHDRAW"}
            </Button>

        </div>



    );
}

export default WithdrawForm;
