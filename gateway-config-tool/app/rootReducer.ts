import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';
import gatewayListReducer from './components/gatewayListSlice';
import selectedGatewayReducer from './components/selectedGatewaySlice';
import userReducer from './components/UserSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    gatewayList: gatewayListReducer,
    selectedGateway: selectedGatewayReducer,
    user: userReducer,
  });
}
