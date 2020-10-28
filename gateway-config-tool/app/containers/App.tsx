import React, { ReactNode } from 'react';
import styles from './App.css';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import { selectGateway } from '../components/selectedGatewaySlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, clearUser, setUser } from '../components/UserSlice';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';
import { clearGateway } from '../components/selectedGatewaySlice';
import { clearGatewayList } from '../components/gatewayListSlice';
import { ErrorSnackBar } from '../components/ErrorSnackBar';




const userList = {
  admin: {
    pass: 'admin@123',
    role: 'admin'
  }
};
//import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "100%",
    },
    logo: {
      color: "red",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      marginLeft: "15px",
    },
    spacer: {
      flexGrow: 1,
    },
    disabledLink : {
      pointerEvents: "none",
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      '& > *': {
        margin: theme.spacing(1.5),
      },
    },
    
  }),
);

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const classes = useStyles();
  const gateway = useSelector(selectGateway);
  const user = useSelector(selectUser);
  const { children } = props;
  const [openModal, setOpenModal] = React.useState(false);
  const [loginInfo, setLoginInfo] = React.useState({userId: '', password: ''});
  const dispatch = useDispatch();
  const [errorDetails, setErrorDetails] = React.useState({ showError: false, errorMessage: "" });

  const handleCloseSnackBar = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }
    setErrorDetails({showError: false, errorMessage: ""});
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleLogin = () => {
    if(userList[loginInfo.userId]) {
      let userInfo = userList[loginInfo.userId];
      if(userInfo.pass === loginInfo.password) {
        dispatch(setUser({
          userId: loginInfo.userId,
          pass: loginInfo.password,
        }));
        handleModalClose();
      } else {
        setErrorDetails({showError: true, errorMessage: "Password Incorrect"});
      }
    } else {
      setErrorDetails({showError: true, errorMessage: "Username Incorrect"});
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearGateway());
    dispatch(clearGatewayList());
    setLoginInfo({userId: '', password: ''});
  };

  const handleUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newLoginInfo = {...loginInfo};
    newLoginInfo.userId = event.target.value as string;
    setLoginInfo(newLoginInfo);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newLoginInfo = {...loginInfo};
    newLoginInfo.password = event.target.value as string;
    setLoginInfo(newLoginInfo);
  };

  let loginLogoutButton;
  if(user) {
    loginLogoutButton = <Link to={routes.HOME}><Button color="inherit" onClick={handleLogout} >Logout</Button></Link>;
  } else {
    loginLogoutButton = <Button color="inherit" onClick={handleModalOpen} >Login</Button>;
  }


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <span className={classes.logo}>WHIRLYBIRD</span>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to={routes.HOME}>
              <Button variant="contained" >
                Home
              </Button>
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to={routes.GATEWAY_CONFIG} className={gateway==null ? classes.disabledLink : ""}>
              <Button variant="contained" >
                Gateway Config
              </Button>
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to={routes.MODBUS_CONFIG} className={gateway==null ? classes.disabledLink : ""}>
              <Button variant="contained" >
                Modbus Config
              </Button>
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to={routes.FIRMWARE_UPDATE} className={gateway==null ? classes.disabledLink : ""}>
              <Button variant="contained" >
                Firmware Update
              </Button>
            </Link>
          </Typography>
          <span className={classes.spacer}></span>
          {loginLogoutButton}
        </Toolbar>
      </AppBar>
      <>{children}</>
      <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Zoom in={openModal}>
              <div className={`${classes.paper} ${styles.container}`} >
                <TextField
                    className={styles.item}
                    id="inp-user"
                    value={loginInfo.userId}
                    onChange={handleUser}
                    label="User ID"
                    variant="outlined"
                />
                <TextField
                    className={styles.item}
                    id="inp-passwd"
                    value={loginInfo.password}
                    onChange={handlePassword}
                    label="Password"
                    variant="outlined"
                    type="password"
                />
                <Button variant="contained" color="primary" onClick={handleLogin} className={styles.btn}>
                  Login 
                </Button>
              </div>
            </Zoom>
          </Modal>
          <ErrorSnackBar 
            open={errorDetails.showError}
            message={errorDetails.errorMessage}
            handleClose={handleCloseSnackBar} 
          />
    </div>
  );
}
