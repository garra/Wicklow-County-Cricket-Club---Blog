import React, { Component, useState, useEffect } from 'react';
import { connect }         from 'react-redux';

import { Grid }   from '@material-ui/core';

import Loader from './loader.js';
import {fetchUserDetails}  from '../redux/actions/user.js';

import '../styles/welcome.css';

function Welcome (props){


    useEffect (() => {
        props.fetchUserDetails()
    },[])
    
    if (props.user.user.length === 0)
        return ( <Loader open={true} handleClose={() =>{}} />);

        return (
            <Grid container className="welcome-container">
                <Grid item xs={12} className="welcome-item">
                Welcome { props.user.user.data.first_name }
                </Grid>
            </Grid>
        )
    
}

function mapStateToProps (state) {
    return {
        user : state.user
    };
}

function mapDispatchToProps (dispatch) {
    return {
        fetchUserDetails : () => dispatch(fetchUserDetails ())
    };
}
export default  (connect (mapStateToProps, mapDispatchToProps)(Welcome));