import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { Navbar, Nav } from 'react-bootstrap';

import Logo from '../assets/Logo.jpg';
import Loader from './loader';

import { fetchUserDetails } from '../redux/actions/user.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/nav.css';

function App(props) {

    const [load, setLoader] = useState(false);

    useEffect(() => {
        if (localStorage.usertoken) {
            setLoader(true);
            if (props.user.user.length === 0)
                props.fetchUserDetails()
        }
    }, [])

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        window.location.reload(false)
    }

    const userLink = () => {

        if (props.user.user.data.role === 'user')
            return (
                <Nav className="mr-auto">
                    <Link to='/feed' className="nav-link">Feeds</Link>
                    <Link to='/add' className="nav-link">Add</Link>
                    <Link to='/edit' className="nav-link">Edit</Link>
                    <a href="" onClick={logout} className="nav-link">Logout</a>
                    <Link to='/contact' className="nav-link">Contact</Link>
                </Nav>
            )
        else if (props.user.user.data.role === 'admin')
            return (
                   <Nav className="mr-auto admin">
                        <Link to='/feed' className="nav-link">Feeds</Link>
                        <Link to='/removeuser' className="nav-link">Remove Users</Link>
                        <Link to='/removefeed' className="nav-link">Remove Feeds</Link>
                        <Link to='/add' className="nav-link">Add Feeds</Link>
                        <a href="" onClick={logout} className="nav-link">Logout</a>
                        <Link to='/contact' className="nav-link">Contact</Link>
                    </Nav>
            )
    }

    const loginReg = () => {
        return (
            <Nav className="mr-auto">
                <Link to='/login' className="nav-link">Login</Link>
                <Link to='/register' className="nav-link">Register</Link>
                <Link to='/contact' className="nav-link">Contact</Link>
            </Nav>
        )
    }
    if (props.user.user.length === 0 && localStorage.usertoken)
        return (<Loader open={load} handleClose={() => { }} />);

    else
        return (
            <Navbar expand="lg" className="nav-navbar">
                <img src={Logo} alt="wickow-county-cc-logo" className="nav-logo" />
                <Navbar.Brand className="name">WICKLOW COUNTY CRICKET CLUB BLOG</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {localStorage.usertoken ? userLink() : loginReg()}
                </Navbar.Collapse>
            </Navbar>

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
export default (connect(mapStateToProps, mapDispatchToProps)(App));