import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';

import Snackbar from './snackbar';
import Loader from './loader';
import EditTable from './edit-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/edit.css';

class Edit extends Component {
    constructor() {
        super();

        this.state = {
            data: null,
            open: false,
            loader: false,
            severity: '',
            message: '',
            anchorEl: null,
            row: null,
            modal: false
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    closeMenu(e) {
        this.setState({ anchorEl: null })
    }
    handleRemove(id) {
        this.setState({ loader: true })
        axios.delete('blogs/delete/' + id)
            .then(res => {
                window.location.reload(false)
            })
            .catch(err => {
                this.setState({
                    open: true,
                    severity: 'error',
                    message: typeof (err) === 'string' ? err : 'Sorry an error occured while removing blog',
                    loader: false
                })
            })
    }
    handleEdit(r) {
        this.setState({
            modal: true,
            row: r
        })
    }
    handleClick(e) {
        this.setState({ anchorEl: e.currentTarget });
    }
    handleClose(e) {
        this.setState({ open: false })
    }
    onClose(e) {
        this.setState({ modal: false })
    }
    componentDidMount() {
        this.setState({ loader: true })
        axios.get('users/profile', {
            headers: { Authorization: ` ${localStorage.usertoken}` }
        })
            .then(response => {
                if (response.data.role === 'admin') {
                    axios.get('blogs/getall/')
                    .then(res => {
                        console.log (res)
                        this.setState({ loader: false, data: res.data })
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            loader: false,
                            open: true,
                            severity: 'error',
                            message: 'Sorry, An error occured. Kindly try to reload'
                        })
                    }) 
                }
                else {
                    this.setState({
                        loader: false,
                        open: true,
                        severity: 'error',
                        message: 'Unauthorized Access'
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    loader: false,
                    open: true,
                    severity: 'error',
                    message: 'Sorry, an error occured!!'
                })
            })
    }

    render() {
        if (!this.state.data)
            return (
                <><Loader open={this.state.loader} handleClose={() => { }} />
                    <Snackbar open={this.state.open} severity={this.state.severity} message={this.state.message} handleClose={this.handleClose} />
                </>);
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={10}>{this.state.row ? <EditTable open={this.state.modal} onClose={this.onClose} value={this.state.row} /> : null}
                        <Loader open={this.state.loader} handleClose={() => { }} />
                        <Snackbar open={this.state.open} severity={this.state.severity} message={this.state.message} handleClose={this.handleClose} />
                    </Grid>
                    <Grid item xs={10} className="edit-table">
                        <div className="edit-your-blog">
                            EDIT YOUR BLOGS
                            </div>
                        <TableContainer className="table-container">
                            <Table aria-label="simple table">
                                <TableBody>
                                    {
                                        this.state.data.slice(0).reverse().map((row, index) =>
                                            <TableRow key={index}>
                                                <TableCell className="title-cell">{row.title}</TableCell>
                                                <TableCell className="report-cell">{row.report}</TableCell>
                                                <TableCell className="icon-cell">
                                                    <div className="icon-div">
                                                        <DeleteIcon onClick={() => { this.handleRemove(row._id) }} className="icon-del" />
                                                    </div>
                                                </TableCell>
                                              </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
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

    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(Edit));