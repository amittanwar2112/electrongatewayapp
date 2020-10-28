import styles from './ViewDeviceModal.css';
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Zoom from '@material-ui/core/Zoom';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);


export function ViewDeviceModal(props: any) {
    const classes = useStyles();
    console.log('from viewCont',props.item);
    return (
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Zoom in={props.open}>
              <div className={`${classes.paper} ${styles.container}`} >
                <div className={styles.item}>
                  <span>Controller ID : </span><span>{props.item.device_id}</span>
                </div>
                <div className={styles.item}>
                  <span>Slave ID : </span><span>{props.item.connection_param.slave_id}</span>
                </div>
                <div className={styles.item}>
                  <span>Controller Type : </span><span>{props.item.device_type}</span>
                </div>
                <div className={styles.item}>
                  <span>Controller Category : </span><span>{props.item.device_category}</span>
                </div>
                <div className={styles.item}>
                  <span>Connection Type : </span><span>{props.item.connection_type}</span>
                </div>
                <div className={styles.item}>
                  <span>Baud Rate : </span><span>{props.item.connection_param.baud_rate}</span>
                </div>
                <div className={styles.item}>
                  <span>Parity : </span><span>{props.item.connection_param.parity}</span>
                </div>
                <div className={styles.item}>
                  <span>Stop Bits : </span><span>{props.item.connection_param.stop_bits}</span>
                </div>
                <div className={styles.item}>
                  <span>Byte Size : </span><span>{props.item.connection_param.byte_size}</span>
                </div>
              </div>
            </Zoom>
          </Modal>
        </div>
    );

}