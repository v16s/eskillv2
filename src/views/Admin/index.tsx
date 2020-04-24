import React from 'react';
import { RouteHandler } from '../../components';
import Dashboard from './Dashboard';
import DefaultCourses from './DefaultCourses';
import Questions from './Questions';
import Progress from './Progress';
import Reset from '../Reset';

const Admin: React.FC = () => {
  return (
    <RouteHandler
      tabs={[
        { value: '/', label: 'Dashboard', component: Dashboard },
        { value: '/questions', label: 'Questions', component: Questions },
        { value: '/progress', label: 'Progress Reports', component: Progress },
        {
          value: '/defaults',
          label: 'Default Courses',
          component: DefaultCourses,
        },
        { value: '/reset', label: 'Reset Password', component: Reset },
      ]}
    ></RouteHandler>
  );
};

export default Admin;
