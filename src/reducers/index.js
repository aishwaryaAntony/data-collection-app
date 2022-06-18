import { combineReducers } from 'redux'
import clientReducer from './clientReducer';
import caseManagerReducer from './caseManagerReducer';
import rbtsReducer from './rbtsReducer';
import programReducer from './programReducer';
import userReducer from './userReducer';
import categoryReducer from './categoryReducer';
import subCategoryReducer from './subCategoryReducer'
import sessionDataReducer from './sessionDataReducer';

const allReducers = combineReducers({
    clientReducer,
    caseManagerReducer,
    rbtsReducer,
    programReducer,
    userReducer,
    categoryReducer,
    subCategoryReducer,
    sessionDataReducer

});
export default allReducers;