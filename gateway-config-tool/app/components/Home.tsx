import React from 'react';
//import { Link } from 'react-router-dom';
//import routes from '../constants/routes.json';
import styles from './Home.css';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { selectGatewayList, clearGatewayList, appendGateway } from './gatewayListSlice';
import { selectGateway, clearGateway, setGateway } from './selectedGatewaySlice';
import { selectUser, clearUser, setUser } from './UserSlice';
import { GatewayEntry } from './GatewayEntry';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const ssdp = require('node-ssdp').Client
, client = new ssdp({})

client.on('notify', function () {
console.log('Got a notification.')
})

client.on('response', function inResponse(headers:any, code:any, rinfo:any) {
  console.log('Got a response to an m-search:\n%d\n%s\n%s', code, JSON.stringify(headers, null, '  '), JSON.stringify(rinfo, null, '  '))
  const gateway = { gatewayId: headers.GATEWAY_ID, ip: rinfo.address };
  addGatewayTolList(gateway);
})


let addGatewayTolList: any;
let selectGtwy: any;

const searchDevices = (dispatch: any) => {
  
  console.log('Searching for devices') ;
  dispatch(clearGatewayList());
  client.search('urn:wrms03-discovery-service')
  setTimeout(function () {
    client.stop()
  }, 10000)
}


export default function Home(): JSX.Element {
  const dispatch = useDispatch();
  const gateway = useSelector(selectGateway);
  const value = useSelector(selectGatewayList);
  const currentGtwy = useSelector(selectGateway);
  const user = useSelector(selectUser);
  console.log(user);
  const classes = useStyles();
  console.log(value);
  addGatewayTolList = (gateway:any) => {
    dispatch(appendGateway(gateway));
  }

  selectGtwy = (gateway: any) => {
    dispatch(setGateway(gateway));
  }

  const axios = require('axios').default;
  const restartGateway = () => {
    console.log('Restarting Gateway')
    if(gateway) {
    axios.get(`http://${gateway.ip}:5000/reboot`)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    }
  };

  return (
    <div className={`${styles.container} ${classes.root}`} data-tid="container">
      <div className={styles.flex_item}>
        <Button variant="contained" color="secondary" onClick={() => {restartGateway()}} className={styles.btn} disabled={currentGtwy == null}>
          Restart 
        </Button>
      </div>
      <div className={styles.flex_item}>
        <Button variant="contained" color="secondary" onClick={() => {searchDevices(dispatch)}} className={styles.btn} disabled={user == null}>
          Scan for Gateways
        </Button>
      </div>
      <div className={styles.flex_item}>
        {value.map((item:any) => { return <GatewayEntry key={item.ip} gatewayId={item.gatewayId} ip={item.ip} setGtwy={selectGtwy} /> })}
      </div>
    </div>
  );
}
