import React from 'react';
//import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './ModbusDevices.css';
import routes from '../../constants/routes.json';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { ErrorSnackBar } from '../../components/ErrorSnackBar';
import { selectGateway } from '../../components/selectedGatewaySlice';
import { useSelector } from 'react-redux';
import { ViewDeviceModal } from './ViewDeviceModal'





const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1.5),
      },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paperModal: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        color: 'black',
        width: '500px',
    }
  }),
);


const manuList = {
    inverter: [
        'DELTA',
        'GOODWE',
        'ABB',
        'CHINT'
    ],
    mfm: [
        'SCHNEIDER',
        'SECURE'
    ],
    wst: [
        'WHIRLYBIRD'
    ]
};

const modlList = {
    DELTA: [
        'RPIM3'
    ],
    ABB: [
        'PVS100',
        '50KW',
        '20KW',
        '33PRO'
    ],
    GOODWE: [
        'GENERIC'
    ],
    CHINT: [
        '50KW',
        '30KW'
    ],
    WHIRLYBIRD: [
        'IRRADIATION',
        'MODULETEMP'
    ],
    SECURE: [
        'ELITE440'
    ],
    SCHNEIDER: [

    ]
};

let i = 0;


function Controller(props) {
    return (
        <Paper elevation={4} className={styles.gtwy_entry} >
            <span className={styles.gtwybtn}>
                {props.conId}
            </span>
            <span></span>
            <span  className={styles.gtwybtn}>
                {props.conCategory}
            </span>
            <span></span>
            <span className={styles.gtwybtn}>
                {props.conType}
            </span>
            <span className={styles.spacer} ></span>
            <Button variant="contained" color="primary" className={styles.gtwybtn}  onClick={props.view}>
                View
            </Button>
            <Button variant="contained" color="primary" className={styles.gtwybtn}  onClick={props.delete}>
                Delete
            </Button>
        </Paper>
    );
}


export default function ModbusDevices() {
    const gateway = useSelector(selectGateway);
    const classes = useStyles();
    const [openModal, setOpenModal] = React.useState(false);
    const [contrList, setContrList] = React.useState([]);
    const [makeList, setMakeList] = React.useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [viewCont, setViewCont] = React.useState(false);
    const [item, setItem] = React.useState({connection_param:{}});
    const [errorDetails, setErrorDetails] = React.useState({ showError: false, errorMessage: "" });
    const [contr, setContr] = React.useState({
        slaveId: '',
        conCat: '',
        make: '',
        model: '',
        connType: '',
        baud: '',
        parity: '',
        stopb: '',
        bytesize: '',
    });

    const axios = require('axios').default;

    

    const getCurrentModbusConfig = React.useCallback(() => {
      if(gateway) {
      axios.get(`http://${gateway.ip}:5000/getmodbus`)
          .then(function (response) {
            // handle success
            console.log(response);
            if(response.data) {
              setContrList(response.data);
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            // always executed
          })
        }
        }, []);
    
    React.useEffect(() => {
      getCurrentModbusConfig()
    }, [getCurrentModbusConfig]);

    //getCurrentModbusConfig();

    const handleViewContOpen = (contrItem) => {
      setItem(contrItem);

      setViewCont(true);
    };

    const handleViewContClose = () => {
      setViewCont(false);
    };

    const handleOpen = () => {
      setOpenModal(true);
    };

    const handleClose = () => {
      setOpenModal(false);
    };

    const handleCloseSnackBar = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setErrorDetails({showError: false, errorMessage: ""});
    };

    const handleSlaveId = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newContr = {...contr};
        newContr.slaveId = event.target.value as string;
        setContr(newContr);
    };

    const handleContCat = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newContr = {...contr};
        newContr.conCat = event.target.value as string;
        setContr(newContr);
        let newMakeList = manuList[newContr.conCat] ? manuList[newContr.conCat] : [];
        setMakeList(newMakeList);
    };

    const handleMakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newContr = {...contr};
        newContr.make = event.target.value as string;
        setContr(newContr);
        let newModelList = modlList[newContr.make] ? modlList[newContr.make] : [];
        setModelList(newModelList);
    };

    const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newContr = {...contr};
        newContr.model = event.target.value as string;
        setContr(newContr);
    };

    const handleConnTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newContr = {...contr};
      newContr.connType = event.target.value as string;
      setContr(newContr);
    };

    const handleBaudChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newContr = {...contr};
      newContr.baud = event.target.value as string;
      setContr(newContr);
    };

    const handleParityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newContr = {...contr};
      newContr.parity = event.target.value as string;
      setContr(newContr);
    };

    const handleStopBitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newContr = {...contr};
      newContr.stopb = event.target.value as string;
      setContr(newContr);
    };

    const handleByteSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newContr = {...contr};
      newContr.bytesize = event.target.value as string;
      setContr(newContr);
    };


    const getConType = ( conCat, make, model ) => {
      let conCat1 = '';
      if (conCat === 'inverter') {
        conCat1 = 'INVERTER';
      } else if ( conCat === 'wst' ) {
        conCat1 = 'WST'
      } else if ( conCat === 'mfm' ) {
        conCat1 = 'MFM'
      }

      let conType = `${conCat1}_${make}_${model}`;

      return conType;
    };

    const validateController = () => {
      if (isNaN(contr.slaveId)) {
        setErrorDetails({showError: true, errorMessage: "Slave Id should be Number"});
        return false;
      }

      return true;
    };

    const addController = () => {
      if (validateController()) {
        let conType = getConType( contr.conCat, contr.make, contr.model );
        let controllerConfig = {
          device_type: conType,
          device_id: 'CON' + contr.slaveId.padStart(3, '0'),
          connection_type: contr.connType,
          device_category: contr.conCat,
          connection_param : {
              slave_id: contr.slaveId,
              baud_rate: contr.baud,
              parity: contr.parity,
              stop_bits: contr.stopb,
              byte_size: contr.bytesize,
          }
        };
        console.log(controllerConfig);
        let newContrList = [...contrList];
        newContrList.push(controllerConfig);
        setContrList(newContrList);
        setContr({
          slaveId: '',
          conCat: '',
          make: '',
          model: '',
          connType: '',
          baud: '',
          parity: '',
          stopb: '',
          bytesize: '',
        });

        handleClose();
        console.log(contrList);
      }
    };

    const gtwyDelete = (devId) => {
      let newContrList = contrList.filter( contr => contr.device_id !== devId );
      setContrList(newContrList);
    };

    const submitConfig = () => {
      axios.post(`http://${gateway.ip}:5000/addmodbus`, contrList)
      .then(function (response) {
        if (response.status == 200) {
          setErrorDetails({showError: true, errorMessage: "Updated Modbus Config Successfully"});
        }
      })
      .catch(function (error) {
        console.log(error);
        setErrorDetails({showError: true, errorMessage: "Error updating Modbus Config"});
      });
    };

    return (
        <div className={`${styles.container} ${classes.root}`}>
            <div className={styles.flex_item}>
              <Button variant="contained" color="secondary" className={styles.btn} onClick={handleOpen}>
                  Add Modbus Device
              </Button>
            </div>
            
            <div className={`${styles.flex_item}`}>
              {contrList.map( (item) => { return <Controller  className={styles.gtwy_entry} key={item.device_id} conId={item.device_id} conCategory={item.device_category} conType={item.device_type} view={()=>{ handleViewContOpen(item); }} delete={ () => { gtwyDelete(item.device_id) }} /> } )}
            </div>

            <div className={styles.flex_item}>
              <Button variant="contained" color="secondary" className={styles.btn} onClick={submitConfig}>
                  Submit
              </Button>
            </div>

            <div >
              <Modal

                className={classes.modal}
                open={openModal}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                  <Zoom in={openModal}>
                    <div className={classes.paperModal}>
                      <form className={`${classes.root} ${styles['flex-item']} ${styles['container-2']}`} noValidate autoComplete="off">
                          <TextField
                              className={styles.inputs}
                              id="inp-slave-id"
                              value={contr.slaveId}
                              onChange={handleSlaveId}
                              label="Slave ID"
                              variant="outlined"
                          />

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-con-cat-label">Controller Category</InputLabel>
                              <Select
                                labelId="inp-con-cat-label"
                                id="inp-con-cat"
                                label="Controller Category"
                                value={contr.conCat}
                                onChange={handleContCat}
                              >
                                <MenuItem value={'inverter'}>Inverter</MenuItem>
                                <MenuItem value={'mfm'}>Multifunction Meter</MenuItem>
                                <MenuItem value={'wst'}>Weather Station</MenuItem>
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-con-make-label">Controller Manufacturer</InputLabel>
                              <Select
                                labelId="inp-con-make-label"
                                id="inp-con-make"
                                label="Controller Manufacturer"
                                value={contr.make}
                                onChange={handleMakeChange}
                              >
                                {makeList.map((item) => { return <MenuItem key={item} value={item}>{item}</MenuItem>; })}
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-con-model-label">Controller Model</InputLabel>
                              <Select
                                labelId="inp-con-model-label"
                                id="inp-con-model"
                                label="Controller Model"
                                value={contr.model}
                                onChange={handleModelChange}
                              >
                                {modelList.map((item) => { return <MenuItem key={item} value={item}>{item}</MenuItem>; })}
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-conn-type-label">Connecion Type</InputLabel>
                              <Select
                                labelId="inp-conn-type-label"
                                id="inp-conn-type"
                                label="Connection Type"
                                value={contr.connType}
                                onChange={handleConnTypeChange}
                              >
                                <MenuItem value={'RTU'}>Serial Wired</MenuItem>
                                <MenuItem value={'RTUoverLORA'}>Serial LoRa</MenuItem>
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-baudrate-label">Baud Rate</InputLabel>
                              <Select
                                labelId="inp-baudrate-label"
                                id="inp-baudrate"
                                label="Baud Rate"
                                value={contr.baud}
                                onChange={handleBaudChange}
                              >
                                <MenuItem value={9600}>9600</MenuItem>
                                <MenuItem value={19200}>19200</MenuItem>
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-parity-label">Parity</InputLabel>
                              <Select
                                labelId="inp-parity-label"
                                id="inp-parity"
                                label="Parity"
                                value={contr.parity}
                                onChange={handleParityChange}
                              >
                                <MenuItem value={'odd'}>Odd</MenuItem>
                                <MenuItem value={'even'}>Even</MenuItem>
                                <MenuItem value={'none'}>None</MenuItem>
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-stopbit-label">Stopbit</InputLabel>
                              <Select
                                labelId="inp-stopbit-label"
                                id="inp-stopbit"
                                label="Stopbit"
                                value={contr.stopb}
                                onChange={handleStopBitChange}
                              >
                                <MenuItem value={'1'}>1</MenuItem>
                                <MenuItem value={'1.5'}>1.5</MenuItem>
                                <MenuItem value={'2'}>2</MenuItem>
                              </Select>
                          </FormControl>

                          <FormControl variant="outlined" className={styles.formcontrol} >
                              <InputLabel id="inp-bytesize-label">Byte Size</InputLabel>
                              <Select
                                labelId="inp-bytesize-label"
                                id="inp-bytesize"
                                label="Byte Size"
                                value={contr.bytesize}
                                onChange={handleByteSizeChange}
                              >
                                <MenuItem value={'6'}>6</MenuItem>
                                <MenuItem value={'7'}>7</MenuItem>
                                <MenuItem value={'8'}>8</MenuItem>
                              </Select>
                          </FormControl>

                          <Button variant="contained" color="primary" className={styles.btn2} onClick={addController}>
                              Add Modbus Device
                          </Button>
                      </form>
                    </div>
                  </Zoom>
              </Modal>
            </div>
            
            <div className={styles.flex_item}>
              <ErrorSnackBar 
                  open={errorDetails.showError}
                  message={errorDetails.errorMessage}
                  handleClose={handleCloseSnackBar} 
              />
            </div>

            <div className={styles.flex_item}>
              <ViewDeviceModal
                item={item}
                open={viewCont}
                handleClose={handleViewContClose}
                />
            </div>
        </div>
    );
}
