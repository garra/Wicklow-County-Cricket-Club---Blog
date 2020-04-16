import {
    createStore,
    applyMiddleware,
    compose }            from 'redux';
import thunk             from 'redux-thunk';

/* Importing user defined functions */
import rootReducer from './reducers/index.js';

const middlewares = [];

middlewares.push (thunk);

const configureStore = () => {
    return createStore (
        rootReducer,
        compose (applyMiddleware(...middlewares))
    );
};

export default configureStore;