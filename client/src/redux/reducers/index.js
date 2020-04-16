/* Importing defaults provided by react and redux */
import { combineReducers } from 'redux';

/* Importing user defined functions */
import User           from './user.js';

const rootReducer = combineReducers ({
    user            : User,
});

export default rootReducer;