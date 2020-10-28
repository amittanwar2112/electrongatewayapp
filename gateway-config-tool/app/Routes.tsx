/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import GatewayConfigPage from './containers/GatewayConfig';
import ModbusDevicesPage from './containers/ModbusDevices';
import FirmwareUpdatePage from './containers/FirmwareUpdate';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.GATEWAY_CONFIG} component={GatewayConfigPage} />
        <Route path={routes.MODBUS_CONFIG} component={ModbusDevicesPage} />
        <Route path={routes.FIRMWARE_UPDATE} component={FirmwareUpdatePage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
