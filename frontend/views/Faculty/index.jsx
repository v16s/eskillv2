import React from "react";
import { Switch, Route } from "react-router-dom";
import { AppBar, Problems } from "../../components";
import { Tabs, Tab, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useLocation, useHistory } from "react-router-dom";
import Dashboard from "./Dashboard";
import Progress from "./Progress";
import Reset from "../Reset";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    maxWidth: "800px",
    zIndex: 1,
  },
}));

const getCurrentLocation = (pathname) => {
  switch (pathname) {
    case "/progress":
      return 1;

    case "/reports":
      return 2;
    case "/reset":
      return 3;
    default:
      return 0;
  }
};

export default () => {
  const location = useLocation();
  const history = useHistory();
  const [value, valueChange] = React.useState(
    getCurrentLocation(location.pathname)
  );
  const handleChange = (e, value) => {
    switch (value) {
      case 0:
        history.push("/");
        break;
      case 1:
        history.push("/progress");
        break;
      case 2:
        history.push("/reports");
        break;
      case 3:
        history.push("/reset");
        break;
    }
    valueChange(value);
  };
  const classes = useStyles();
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ zIndex: 2 }}>
        <AppBar />
      </div>

      <Paper className={classes.paper}>
        <Tabs
          variant="fullWidth"
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab label="Incoming Requests" />
          <Tab label="Student Progress" />
          <Tab label="Problem Reports" />
          <Tab label="Reset Password" />
        </Tabs>

        <Switch>
          <Route path="/reports">
            <Problems />
          </Route>
          <Route path="/reset" component={() => <Reset noshadow />} />
          <Route path="/progress" component={Progress} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </Paper>
    </div>
  );
};
