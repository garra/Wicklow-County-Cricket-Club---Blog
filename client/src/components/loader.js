import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import '../styles/app.css'
export default function Loader(props) {    
    return (
      <div>
        <Backdrop open={props.open} onClick={props.handleClose} style={{zIndex: "100"}}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
  