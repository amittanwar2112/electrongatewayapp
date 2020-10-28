import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import styles from './GatewayEntry.css';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';



export function GatewayEntry(props: any) {
    return(
        <div>
            <Paper elevation={4} className={styles.container} >
                <span className={styles.item}>{props.gatewayId}</span>
                <span className={styles.item}>{props.ip}</span>
                <span className={styles.spacer}></span>
                <Link to={routes.GATEWAY_CONFIG}>
                    <Button className={styles.btn} variant="contained" color="primary" onClick={() => { props.setGtwy({gatewayId:props.gatewayId, ip:props.ip}) }}>
                        Configure
                    </Button>
                </Link>
            </Paper>
        </div>
    );
}