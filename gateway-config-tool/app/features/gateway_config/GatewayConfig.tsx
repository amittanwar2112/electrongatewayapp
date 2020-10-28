import React from 'react';
import styles from './GatewayConfig.css';
import { selectGateway } from '../../components/selectedGatewaySlice';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ErrorSnackBar } from '../../components/ErrorSnackBar';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
    },
  }),
);


export default function GatewayConfig() {
    const gateway = useSelector(selectGateway);
    const axios = require('axios').default;
    
    console.log(gateway);
    const [config, setConfig] = React.useState({
        device_id: "",
        periodic_interval: "300",
        http_url: "",
        lora_channel: "5"
    });

    const handleGtwyIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newConfig = {...config};
        newConfig.device_id = event.target.value as string;
        setConfig(newConfig);
    };

    const handlePerIntChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newConfig = {...config};
        newConfig.periodic_interval = event.target.value as string;
        setConfig(newConfig);
    };

    const handleServerUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newConfig = {...config};
        newConfig.http_url = event.target.value as string;
        setConfig(newConfig);
    };

    const [errorDetails, setErrorDetails] = React.useState({ showError: false, errorMessage: "" });

    const classes = useStyles();

    const handleChangeLora = (event: React.ChangeEvent<{ value: unknown }>) => {
        let newConfig = {...config};
        newConfig.lora_channel = event.target.value as string;
        setConfig(newConfig);
    };

    const validateConfig = () => {
        if (config.device_id === "" || config.device_id == undefined) {
            setErrorDetails({showError: true, errorMessage: "Please Enter Gateway ID"});
            return false;
        }
        if (config.periodic_interval === "" || config.periodic_interval == undefined) {
            setErrorDetails({showError: true, errorMessage: "Please Enter Periodic Interval"});
            return false;
        }
        if (config.http_url === "" || config.http_url == undefined) {
            let newConfig = {...config};
            newConfig.http_url = 'http://solarpro.online:8080/receiver/JsonReceiver';
            setConfig(newConfig);
        } else if (!config.http_url.includes('http://') && !config.http_url.includes('https://')) {
            setErrorDetails({showError: true, errorMessage: "Please enter a valid server URL"});
            return false;
        }
        if (isNaN(parseInt(config.periodic_interval))) {
            setErrorDetails({showError: true, errorMessage: "Periodic Interval should be Number"});
            return false;
        }

        

        return true;
    };

    const handleCloseSnackBar = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorDetails({showError: false, errorMessage: ""});
    };

    const updateConfigHandler = () => {
        if(validateConfig()) {
            console.log('Config is valid', config);
            axios.post(`http://${gateway.ip}:5000/updatemainconfig`, config)
            .then(function (response) {
              if (response.status == 200) {
                setErrorDetails({showError: true, errorMessage: "Updated Main Config Successfully"});
              }
            })
            .catch(function (error) {
              console.log(error);
              setErrorDetails({showError: true, errorMessage: "Error updating Main Config"});
            });
        }
    };

    return (
        <div className={styles.main_container}>
            <Paper elevation={4} className={styles.container} >
                <h3 className={`${styles.heading} ${styles['flex-item']}`}>Enter Gateway Configuration Details</h3>
                <form className={`${classes.root} ${styles['flex-item']} ${styles['container-2']}`} noValidate autoComplete="off">
                    <TextField
                        className={styles.inputs}
                        id="inp-gateway-id"
                        //value={config.lora_channel}
                        onChange={handleGtwyIdChange}
                        label="Gateway ID"
                        variant="outlined"
                    />
                    <TextField
                        className={styles.inputs}
                        id="inp-per-interval"
                        //value={config.periodic_interval}
                        onChange={handlePerIntChange}
                        label="Periodic Interval (seconds)"
                        variant="outlined"
                    />
                    <TextField
                        className={styles.inputs}
                        id="inp-server-url"
                        //value={config.serverUrl}
                        onChange={handleServerUrlChange}
                        label="Server URL"
                        variant="outlined"
                    />
                    <FormControl variant="outlined" className={styles.formcontrol}>
                        <InputLabel id="inp-lora-channel-label">Lora Channel</InputLabel>
                        <Select
                          labelId="inp-lora-channel-label"
                          id="inp-lora-channel"
                          value={config.lora_channel}
                          onChange={handleChangeLora}
                          label="Lora Channel"
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={6}>6</MenuItem>
                          <MenuItem value={7}>7</MenuItem>
                          <MenuItem value={8}>8</MenuItem>
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" className={styles.btn} onClick={updateConfigHandler}>
                        Update Config
                    </Button>
                </form>
            </Paper>
            <ErrorSnackBar 
                open={errorDetails.showError}
                message={errorDetails.errorMessage}
                handleClose={handleCloseSnackBar} 
            />
        </div>
    );
}
