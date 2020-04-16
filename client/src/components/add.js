import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import { storage } from '../firebase-config.js';

import { Grid } from '@material-ui/core';

import {fetchUserDetails}  from '../redux/actions/user.js';

import Snackbar from './snackbar';
import Loader from './loader';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/form.css';

class Add extends Component {

    constructor() {
        super();

        this.state = {
            title: '',
            report: '',
            file: null,
            urls: [],
            open: false,
            loader: false,
            severity: '',
            message: '',
            uId: null
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.upload = this.upload.bind(this)
    }

    componentDidMount () {
        this.props.fetchUserDetails();
    }
    handleClose(e) {
        this.setState({ open: false })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onChangeHandler = e => {
        this.setState({
            file: e.target.files,
        })
    }
    upload(callback) {
        if (!this.state.file) {
            callback({
                userId: this.props.user.user.data._id,
                name: this.props.user.user.data.first_name + " " + this.props.user.user.data.surname,
                title: this.state.title,
                report: this.state.report,
                image: this.state.urls
            })
            return;
        }
        for (let i = 0; i < this.state.file.length; i++) {
            let currentImageName = "firebase-image-" + Date.now();
            if (this.state.file[i].type.split('/')[0] !== 'image') {
                this.setState({
                    loader: false,
                    open: true,
                    severity: 'error',
                    message: "FIle type not supported"
                })
                return;
            }
            let uploadImage = storage.ref(`images/${currentImageName}`).put(this.state.file[i]);
            uploadImage.on('state_changed',
                (snapshot) => { },
                (error) => {
                    alert(error);
                },
                () => {
                    storage.ref('images').child(currentImageName).getDownloadURL().then(url => {
                        this.setState({ urls: this.state.urls.concat(url) })

                        if (this.state.file.length === this.state.urls.length) {
                            callback({
                                userId: this.props.user.user.data._id,
                                name: this.props.user.user.data.first_name + " " + this.props.user.user.data.surname,
                                title: this.state.title,
                                report: this.state.report,
                                image: this.state.urls
                            })
                            return;
                        }
                    });
                })
        }

    }


    onSubmit(e) {
        e.preventDefault();

        if (!this.state.title) {
            this.setState({
                open: true,
                severity: 'error',
                message: 'Title is required',
            })
            return;
        }
        if (this.state.file && this.state.file.length > 10) {
            this.setState({
                open: true,
                severity: 'error',
                message: 'Maximum 10 files can be uploaded at once'
            })
            return;
        }

        this.setState({ loader: true })


        let currentState = this;

        this.upload(function (res) {
            const imageObj = {
                userId: res.userId,
                name: res.name,
                title: res.title,
                report: res.report,
                image: res.image
            };

            axios.post('blogs/add', imageObj)
                .then((data) => {

                    if (data.data.status) {

                        currentState.setState({
                            loader: false,
                            open: true,
                            severity: 'success',
                            message: "Blog Posted Successfully",
                        })
                        window.location.replace('/feed')
                    }
                    else {
                        currentState.setState({
                            loader: false,
                            open: true,
                            severity: 'error',
                            message: data
                        })
                    }
                })
                .catch((err) => {
                    currentState.setState({
                        loader: false,
                        open: true,
                        severity: 'error',
                        message: typeof (err) === 'string' ? err : 'Sorry an error occured while posting',
                    })
                });
        })
    }


    render() {


        return (
            <Grid item xs={10} className="form-container">
                <Loader open={this.state.loader} handleClose={() => { }} />
                <Snackbar open={this.state.open} severity={this.state.severity} message={this.state.message} handleClose={this.handleClose} />
                <Grid item xs={12} lg={6} className="form-item">
                <Grid item xs={12} className="form" align="center">Add Your Blog!</Grid>
                <Grid item xs={6} className="form-form-item">
                    <form className="form-form" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label className="form-label">Match Title</label>
                            <input type="name" className="form-control form-credential" required name="title" value={this.state.title} onChange={this.onChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Match Report</label>
                            <textarea className="form-control form-credential" rows="8" maxLength="400" name="report" value={this.state.report} onChange={this.onChange} />
                            <label className="form-character">{400 - this.state.report.length} characters left</label>
                        </div>
                        <div className="form-group">
                            <div><label className="form-label">Upload Photos</label></div>
                            <input type="file" name="file" multiple accept="image/*" onChange={this.onChangeHandler} />
                        </div>
                        <button type="submit" className="form-button" onClick={this.onSubmit}>POST</button>
                    </form>
                </Grid>
                </Grid>
            </Grid>
        )
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserDetails : () => dispatch(fetchUserDetails ())
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(Add));