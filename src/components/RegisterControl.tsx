import { Paper, Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { compose } from 'recompose';
const TOGGLE_STUDENT = gql`
  mutation {
    toggleStudentRegistration {
      result
    }
  }
`;
const TOGGLE_FACULTY = gql`
  mutation {
    toggleFacultyRegistration {
      result
    }
  }
`;
const GET_STUDENT_FACULTY = gql`
  {
    global {
      regs
      regf
    }
  }
`;

class RegisterControlBase extends React.Component<any, any> {
  state: any = {
    student: true,
    faculty: false,
  };
  handleChange = (name) => {
    if (name) {
      this.props.toggleStudentRegistration().then((data) => {
        this.setState({ student: !this.state.student }, () => {
          this.props.data.refetch();
        });
      });
    } else {
      this.props.toggleFacultyRegistration().then((data) => {
        this.setState({ faculty: !this.state.faculty }, () => {
          this.props.data.refetch();
        });
      });
    }
  };
  componentDidMount() {
    let { global: glob } = this.props.data;
    if (glob) {
      this.setState({ student: glob.regs, faculty: glob.regf });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.global) {
      nextState.student = nextProps.data.global.regs;
      nextState.faculty = nextProps.data.global.regf;
    }
    return true;
  }
  render() {
    return (
      <Paper
        style={{
          display: 'flex',
          margin: '20px',
          padding: '20px',
          justifyContent: 'space-around',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={this.state.student}
              onChange={() => this.handleChange(true)}
              value='student'
              color='primary'
            />
          }
          label='Student'
        />
        <FormControlLabel
          control={
            <Switch
              checked={this.state.faculty}
              onChange={() => this.handleChange(false)}
              value='faculty'
              color='primary'
            />
          }
          label='Faculty'
        />
      </Paper>
    );
  }
}
export const RegisterControl = compose(
  graphql(TOGGLE_FACULTY, { name: 'toggleFacultyRegistration' }),
  graphql(TOGGLE_STUDENT, { name: 'toggleStudentRegistration' }),
  graphql(GET_STUDENT_FACULTY)
)(RegisterControlBase);
