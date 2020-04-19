import React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Progress from "./Progress";
import { Tabs, Tab } from "@material-ui/core";
import { AppBar } from "../../components";
import { withRouter } from "react-router-dom";
import Reset from "../Reset";
export default withRouter(
  class Admin extends React.Component {
    constructor(props) {
      super(props);
      let location = 0;
      switch (props.history.location.pathname) {
        case "/reports":
          location = 1;
          break;
        case "/reset":
          location = 2;
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
          this.props.history.push("/reports");
          break;
        case 2:
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
            <Tab label="Reports" />
            <Tab label="Reset Password" />
          </Tabs>
          <Switch>
            <Route path="/reset" component={Reset} />
            <Route path="/reports" component={Progress} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </div>
      );
    }
  }
);
