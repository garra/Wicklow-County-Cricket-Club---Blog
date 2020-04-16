import React          from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal          from '@material-ui/core/Modal';
import Backdrop       from '@material-ui/core/Backdrop';
import Fade           from '@material-ui/core/Fade';
import ClearIcon      from '@material-ui/icons/Clear';

import { connect }              from 'react-redux';
import { fetchUserDetails }     from '../redux/actions/user.js';
import axios                    from 'axios';
import { storage }              from '../firebase-config.js';
import { Form, Button, Figure } from 'react-bootstrap';

import Snackbar from './snackbar';
import Loader   from './loader';

import '../styles/edit-table.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function Component(props) {
  const classes = useStyles();

  const [title, setTitle] = React.useState(props.value.title);
  const [report, setReport] = React.useState(props.value.report);
  const [image, setImage] = React.useState(props.value.image);
  const [urls, setUrls] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [load, setLoader] = React.useState(false);
  const [open, setModal] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [message, setMessage] = React.useState('');
  
  const upload = (callback) => {
    if (typeof (files[0]) === 'undefined') {
      callback();
      return;
    }
    
    const promises = [];

    for (let i = 0; i < files[files.length-1].length; i++) {
      let currentImageName = "firebase-image-" + Date.now();

      if (files[files.length-1][i].type.split('/')[0] !== 'image') {
        setLoader(false);
        setSeverity('error');
        setMessage('FIle type not supported!!!!');
        setModal(true);
        return;
      }
      let uploadImage = storage.ref(`images/${currentImageName}`).put(files[files.length-1][i]);
      promises.push(uploadImage);
      uploadImage.on('state_changed',
        (snapshot) => {},
        (error) => {
          setLoader(false);
        setSeverity('error');
        setMessage('Error while upl');
        setModal(true);
        return;
        },
        () => {
          storage.ref('images').child(currentImageName).getDownloadURL().then(url => {
            setUrls (urls.push (url))
            setImage (image.push (url))
            console.log ('====', urls.length, files[files.length-1].length)
           if(urls.length === files[files.length-1].length)
           {console.log ('yes')
            callback ();
           }
          });
        })
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()

    if (!title) {
      setLoader(false);
      setSeverity('error');
      setMessage('Title is Required!!!!');
      setModal(true);
      return;
    }

    if (typeof (files[files.length-1]) !== 'undefined' && files[files.length-1].length + image.length > 10) {
      setFiles([]);
      setLoader(false);
      setSeverity('error');
      setMessage('Files not more than 10');
      setModal(true);
      return;
    }

    setLoader(true);
    upload(function (res) {

      const obj = {
        title: title,
        report: report,
        image: image,
      }
    console.log (obj)
      axios.put('/blogs/update/' + props.value._id, obj)
        .then(res => {
          setLoader(false);
          setSeverity('success');
          setMessage('Changes Updated!!!')
          setModal(true);
          window.location.reload(false)
        })
        .catch(err => {
          setLoader(false);
          setSeverity('error');
          setMessage(typeof (err) === 'string' ? err : 'Sorry an error occured while updating. Try again later.')
          setModal(true);
        })
    });
  }

  const getImages = () => {

    let figs = [];
    for ( let img in image ) {
      figs.push (
        <span key={img} className="img-box">
          <Figure.Image width={50} height={50} src={image[img]} value={image[img]} />
          <ClearIcon className="cross" onClick={() => { setImage (image.filter(el => el !== image[img]))}} />
        </span>
      );
    }
    return figs;
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <Loader open={load} handleClose={() => { }} />
            <Snackbar open={open} severity={severity} message={message} handleClose={(e) => setModal(false)} />
            <Form>
              <Form.Group onSubmit={onSubmit}>
                <Form.Label>Title</Form.Label>
                <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Report</Form.Label>
                <Form.Control as="textarea" rows="3" value={report} maxLength="400" onChange={(e) => setReport(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Figure>  {getImages()} </Figure>
              </Form.Group>
              <Form.Group>
                <Form.File  label="Add Images" accept="image/*" multiple onChange={(e) => {setFiles(files.concat(e.target.files))}} />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={onSubmit}>
                Submit
                </Button>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}


function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUserDetails: () => dispatch(fetchUserDetails())
  };
}
export default (connect(mapStateToProps, mapDispatchToProps)(Component));