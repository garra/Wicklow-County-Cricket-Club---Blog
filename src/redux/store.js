import {
    createStore,
    applyMiddleware,
    compose }            from 'redux';
import thunk             from 'redux-thunk';
import { createLogger }  from 'redux-logger';

/* Importing user defined functions */
import rootReducer from './reducers/index.js';

/* Add different options to logger for advanced logging */
const logger = createLogger({
    collapsed: true
});

const middlewares = [];

middlewares.push (thunk);

/* Logger should be at last in middlewares to record all events */
if (process.env.NODE_ENV !== `production`) {
    middlewares.push (logger);
}

const configureStore = () => {
    return createStore (
        rootReducer,
        compose (applyMiddleware(...middlewares))
    );
};

export default configureStore;