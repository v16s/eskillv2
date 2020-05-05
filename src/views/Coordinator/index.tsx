import React from 'react';
import { RouteHandler, Problems } from '../../components';
import Questions from './Questions';
import Progress from './Progress';

const Coordinator: React.FC = () => {
  return (
    <RouteHandler
      tabs={[
        { value: '/', label: 'Questions', component: Questions },
        { value: '/progress', label: 'Progress Reports', component: Progress },
        { value: '/reports', label: 'Problem Reports', component: Problems },
      ]}
    ></RouteHandler>
  );
};

export default Coordinator;
