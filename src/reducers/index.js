import { combineReducers } from 'redux';
import data from './data';
import contract from './contract';
import service from './service';

export default combineReducers({ data, contract, service });
