import React from 'react';
import { useHistory, useLocation, Switch, Route } from 'react-router-dom';

import { Tabs, Tab } from '@material-ui/core';
import { AppBar } from './';

export const RouteHandler: React.FC<{
  tabs: { value: string; component: any; label: string }[];
}> = ({ tabs }) => {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const handleChange = (e: React.ChangeEvent<{}>, value: string) => {
    push(value);
  };
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
      }}
    >
      <AppBar />
      <Tabs
        value={pathname}
        indicatorColor='primary'
        textColor='primary'
        onChange={handleChange}
      >
        {tabs.map((tab) => (
          <Tab key={`key-${tab.value}`} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      <Switch>
        {[...tabs].reverse().map((tab) => (
          <Route
            key={`route-${tab.value}`}
            path={tab.value}
            component={tab.component}
          />
        ))}
      </Switch>
    </div>
  );
};
