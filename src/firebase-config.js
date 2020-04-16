import firebase from 'firebase/app';
import 'firebase/storage';

var config = {
  apiKey: "AIzaSyA5EXd-XtSIhjCHRwfOrZNNuWL_hRUMAl4",
  authDomain: "wicklow-county-cricket.firebaseapp.com",
  databaseURL: "https://wicklow-county-cricket.firebaseio.com",
  projectId: "wicklow-county-cricket",
  storageBucket: "wicklow-county-cricket.appspot.com",
  messagingSenderId: "1096757592176",
  appId: "1:1096757592176:web:ce132431a5ba032cc8b4b5",
  measurementId: "G-3N3PTEWPE7"
};
firebase.initializeApp(config);

var storage = firebase.storage();

export {
  storage, firebase as default
};