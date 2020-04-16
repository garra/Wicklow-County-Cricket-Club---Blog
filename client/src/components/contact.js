import React from 'react';

import { Grid } from '@material-ui/core';
import { Card } from 'react-bootstrap';

import '../styles/contact.css';

function App() {
    return (
            <Grid item xs={10} lg={6} className="contact-container">
                <Card className="contact-card">
                    <Card.Body>
                        <Card.Title className="contact-details">CONTACT DETAILS</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted detail-key">
                            <span style={{marginRight: 3}}>CONTACT NUMBER: </span>
                        <span className="mb-2 text-muted detail-value">0871145432
                        </span>
                        </Card.Subtitle>
                       <Card.Subtitle className="mb-2 text-muted detail-key">
                           <span  style={{marginRight: 3}}>EMAIL ID: </span> 
                        <Card.Link href="wicklowcountycricket@gmail.com" className="detail-value">wicklowcountycricket@gmail.com</Card.Link>
                        </Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted detail-key"> 
                        <span style={{marginRight: 3}}>WEBSITE: </span>
                        <Card.Link href="wicklowcountycricket.com/" className="detail-value"> wicklowcountycricket.com/</Card.Link>
                        </Card.Subtitle>
                    </Card.Body>
                </Card>
            </Grid>
    );
}
export default App;