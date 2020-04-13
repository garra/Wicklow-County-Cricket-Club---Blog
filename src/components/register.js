import React, { Component } from 'react';

import axios from 'axios';

import { Grid, Button } from '@material-ui/core';

import Snackbar from './snackbar';
import Loader from './loader';

import '../styles/form.css';

class Register extends Component {
  constructor() {
    super()
    this.state = {
      first_name: '',
      surname: '',
      username: '',
      email: '',
      mobile: '',
      password: '',
      open: false,
      severity: '',
      loader: false,
      message: ''
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
    const newUser = {
      first_name: this.state.first_name,
      surname: this.state.surname,
      username: this.state.username,
      email: this.state.email,
      mobile: this.state.mobile,
      password: this.state.password
    }


    axios.post('users/register', newUser)
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
          this.setState({
            open: true,
            severity: 'success',
            message: 'Registered Successfully',
            loader: false
          })

          setTimeout(window.location.replace('/'), 5000)
        }
      })

      .catch(err => {
        this.setState({ loader: false })
        if ( err.response && err.response.status === 422) {
          let errors = '';
          for (let i in err.response.data) {
            errors += err.response.data[i].msg + '\n'
          }

          this.setState({
            open: true,
            severity: 'error',
            message: errors
          })
        }

        else {
          this.setState({
            open: true,
            severity: 'error',
            message: typeof (err) === 'string' ? err : 'Sorry an error occured during registration. Try again later'
          })
        }
      })

  }

  render() {
    return (

      <Grid item xs={10} md={8} className="form-container">
        <Loader open={this.state.loader} handleClose={()=>{}} />
        <Snackbar open={this.state.open} severity={this.state.severity} message={this.state.message} handleClose={this.handleClose} />
        <Grid item xs={12} lg={6} className="form-item">
                    <Grid container>
        < Grid item xs={12} className="form">REGISTER</Grid>
        <Grid item xs={6} className="form-form-item">
          <form className="form-form" onSubmit={this.onSubmit}>
            <input className="form-credential" required type="text" placeholder="First Name" name="first_name" value={this.state.first_name} onChange={this.onChange} />
            <input className="form-credential" type="text" placeholder="Surname" name="surname" value={this.state.surname} onChange={this.onChange} />
            <input className="form-credential" required type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.onChange} />
            <input className="form-credential" required type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.onChange} />
            <input className="form-credential" required placeholder="Mobile" name="mobile" value={this.state.mobile} onChange={this.onChange} />
            <input className="form-credential" required type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
            <Button className="form-button" onClick={this.onSubmit}>Register!</Button>
          </form>
        </Grid>
        </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default Register