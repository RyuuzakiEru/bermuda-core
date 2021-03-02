import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column'
    },
    yellowBg: {
        backgroundColor: theme.palette.primary.main,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    note: {
        fontSize: theme.typography.pxToRem(12),
        overflowWrap: 'anywhere'
    }
}));

const InfoPanel = ({ info }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    useEffect( () => {
        setExpanded((info && info.note))
    }, [info]);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={classes.root}>
            <Accordion  className={classes.yellowBg}  disabled={info === {}} expanded={expanded} onChange={handleChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    <Typography className={classes.heading}>{ info && info.status || "Status:" }</Typography>
                    <Typography className={classes.secondaryHeading}>{ info && info.message || "Idle" }</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.note}>
                    { info && info.note || "" }
                </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default InfoPanel;
