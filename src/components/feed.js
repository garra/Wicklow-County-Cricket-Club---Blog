import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { Grid } from '@material-ui/core';
import { Card, Carousel } from 'react-bootstrap';

import Snackbar from './snackbar';

import '../styles/feed.css';


function Feed(props) {

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('blogs/get')
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                setOpen (true);
                setSeverity ('error');
                setMessage ( 'Some error occured while fetching data. Please try again')
            })
    }, [])

    const handleClose =  () => {
        setOpen (false);
    }

    const getImages = (image) => {

        if (image.length === 1) 
        return     <Card.Img className="feed-image" variant="top" src={image[0]} alt={image[0]} />

        const images = image.map((url, index) =>
            <Carousel.Item key={index}>
                <Card.Img className="feed-image" variant="top" src={url} alt={url} />
            </Carousel.Item>
        );
        return (<Carousel>{images}</Carousel>);
    }
    const fun = () => {
        let card = [];
        for (let i = data.length-1; i>=0; i--) {
            card.push(
                <Card key={i} className="feed-card">
                     <Card.Title>{data[i].name}</Card.Title>
                    {data[i].image ? getImages(data[i].image) : null}
                    <Card.Body>
                        <Card.Title>{data[i].title}</Card.Title>
                        <Card.Text>{data[i].report}</Card.Text>
                    </Card.Body>
                </Card>
            );
        }
        return card;


    }
    return (
        <Grid container className="feed-container">
            <Grid item xs={12}>
            <Snackbar open={open} severity={severity} message={message} handleClose={handleClose} />
            </Grid>
            <Grid item xs={8} md={6} className="feed-item" >
            {fun()}
            </Grid>
        </Grid>
    )

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
export default (connect(mapStateToProps, mapDispatchToProps)(Feed));