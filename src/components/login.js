import React, { Component } from 'react';

import axios from 'axios';

import { Grid, Button } from '@material-ui/core';

import Snackbar from './snackbar';
import Loader   from './loader';

import '../styles/form.css';

class Login extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            open: false,
            severity: '',
            message: '',
            loader: false
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }


    handleClose(e) {
        this.setState({ open: false })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault()
        this.setState({ loader: true })
        const user = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post('users/login', {
            username: user.username,
            password: user.password
        })
            .then(response => {
                if (response.data.error) {
                    this.setState({
                        open: true,
                        severity: 'error',
                        message: response.data.error,
                        loader: false
                    })
                }
                else {
                    localStorage.setItem('usertoken', response.data)
                    window.location.replace('/feed')
                }
            })

            .catch(err => {
                this.setState({
                    open: true,
                    severity: 'error',
                    message: typeof (err) === 'string' ? err : 'Sorry an error occured while login',
                    loader: false
                })
            })
    }

    render() {
        return (
            <Grid item xs={10} md={8} className="form-container">
                <Loader open={this.state.loader} handleClose={() =>{}} />
                <Snackbar open={this.state.open} severity={this.state.severity} message={this.state.message} handleClose={this.handleClose} />
                <Grid item xs={12} lg={6} className="form-item">
                    <Grid container>
                < Grid item xs={12} className="form" align="center">LOGIN</Grid>
                <Grid item xs={6} className="form-form-item">
                    <form className="form-form" onSubmit={this.onSubmit}>
                        <input className="form-credential" type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.onChange} />
                        <input className="form-credential" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                        <button className="form-button" onClick={this.onSubmit}>Let me In!</button>
                    </form>
                </Grid>
                </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default Login