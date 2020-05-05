import React from 'react';
import { RouteHandler } from '../../components';
import Dashboard from './Dashboard';
import Progress from './Progress';
import Reset from '../Reset';

const Campus: React.FC = () => {
  return (
    <RouteHandler
      tabs={[
        { value: '/', label: 'Dashboard', component: Dashboard },
        { value: '/progress', label: 'Progress Reports', component: Progress },
        { value: '/reset', label: 'Reset Password', component: Reset },
      ]}
    ></RouteHandler>
  );
};

export default Campus;
