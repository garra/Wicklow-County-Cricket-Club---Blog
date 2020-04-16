import { AUTH_USER_DETAILS } from '../types.js';

import axios from 'axios';

export const updateLeaderboardTable = (data) => {
    return {
            type: AUTH_USER_DETAILS,
            data
        };
};

export const fetchUserDetails = () => async (dispatch, getState) => {
   
     axios.get('users/profile', {
          headers: { Authorization: ` ${localStorage.usertoken}` }
        })
        .then(response => {
            dispatch (updateLeaderboardTable (response));
        })
        .catch(err => {
            return err;
        });
    return ;
};