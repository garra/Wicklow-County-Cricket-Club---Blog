import React, { useRef } from 'react';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
function App (props) {
    
    const { open, handleClose, severity, message } = props;
    
    return (
        <Snackbar anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>{message} </Alert>
      </Snackbar>
      );
}

export default App;