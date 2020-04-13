import { AUTH_USER_DETAILS } from '../types.js';

const initialState = {
    user   : []
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_USER_DETAILS :
            return { user : action.data };

        default:
            return state;
    }
};

export default Reducer;