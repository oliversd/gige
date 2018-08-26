import { combineReducers } from 'redux';
import data from './data';
import contract from './contract';
import service from './service';
import order from './order';
import serviceList from './serviceList';
import orderList from './orderList';

export default combineReducers({
  data,
  contract,
  service,
  serviceList,
  order,
  orderList
});
