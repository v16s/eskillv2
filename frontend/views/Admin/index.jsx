import React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import DefaultCourses from "./DefaultCourses";
import Questions from "./Questions";
import Progress from "./Progress";
import Reset from "../Reset";

import { Tabs, Tab } from "@material-ui/core";
import { AppBar } from "../../components";
import { withRouter } from "react-router-dom";
export default withRouter(
  class Admin extends React.Component {
    constructor(props) {
      super(props);
      let location = 0;
      switch (props.history.location.pathname) {
        case "/questions":
          location = 1;
          break;
        case "/reports":
          location = 2;
          break;
        case "/defaults":
          location = 3;
          break;
        case "/reset":
          location = 4;
      }
      this.state = {
        value: location,
      };
    }
    handleChange = (e, value) => {
      switch (value) {
        case 0:
          this.props.history.push("/");
          break;
        case 1:
          this.props.history.push("/questions");
          break;
        case 2:
          this.props.history.push("/reports");
          break;
        case 3:
          this.props.history.push("/defaults");
          break;
        case 4:
          this.props.history.push("/reset");
          break;
      }
      this.setState({ value });
    };
    render() {
      const { value } = this.state;
      return (
        <div
          style={{
            width: "100vw",
            minHeight: "100vh",
          }}
        >
          <AppBar />
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
          >
            <Tab label="Dashboard" />
            <Tab label="Questions" />
            <Tab label="Progress Reports" />
            <Tab label="Default Courses" />
            <Tab label="Reset Password" />
          </Tabs>
          <Switch>
            <Route path="/reset" component={Reset} />
            <Route path="/defaults" component={DefaultCourses} />
            <Route path="/reports" component={Progress} />
            <Route path="/questions" component={Questions} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </div>
      );
    }
  }
);
