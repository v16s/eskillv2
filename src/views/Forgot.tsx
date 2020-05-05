import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import {
  TextField,
  Typography,
  Paper,
  Button,
  IconButton,
} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql, withApollo } from '@apollo/react-hoc';
import { compose } from 'recompose';
import { Tonality } from '@material-ui/icons';

const FORGOT = gql`
  mutation Forgot($username: String!) {
    forgot(username: $username)
  }
`;
const GET_DARK = gql`
  {
    dark @client
  }
`;
const GET_REGISTER_PERMIT = gql`
  {
    global {
      regs
      regf
    }
  }
`;
const CHANGE_DARK = gql`
  mutation ChangeDark($dark: Boolean!) {
    changeDark(dark: $dark) @client
  }
`;
const styles = (theme) => ({
  paper: {
    width: '80%',
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  input: {
    marginTop: '15px',
    width: '100%',
  },
  heading: {
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    marginTop: '10px',
  },
  login: {
    background: `linear-gradient( 135deg, ${theme.palette.primary.main} 40%, ${theme.palette.primary.dark} 100%)`,
  },
  titleBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

class Forgot extends React.Component<any, any> {
  state: any = {
    username: '',
  };
  onInputChange = (e) => {
    let newstate = this.state;
    newstate[e.target.id] = e.target.value;
    this.setState(newstate);
  };
  onSubmit = (e) => {
    e.preventDefault();
    let { history } = this.props;
    this.props
      .mutate({ variables: this.state })
      .then(({ data: { forgot } }) => {
        if (forgot) {
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { classes, dark, registerPermit, history } = this.props;
    const { username } = this.state;
    return (
      <div className={classes.paper}>
        <div className={classes.titleBar}>
          <Typography color='primary' variant='h5' className={classes.heading}>
            eSkill
          </Typography>
          <IconButton
            color='primary'
            onClick={(e) => {
              this.props.changeDark({ variables: { dark: !dark.dark } });
            }}
          >
            <Tonality />
          </IconButton>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className={classes.input}>
            <TextField
              className={classes.input}
              variant='outlined'
              id='username'
              type='text'
              onChange={this.onInputChange}
              label='Register Number / User ID'
              value={username}
            />
          </div>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            className={`${classes.button} ${classes.login}`}
            type='submit'
            style={{ color: '#fff' }}
          >
            Send Recovery Email
          </Button>
        </form>
        {registerPermit.global &&
          (registerPermit.global.regs || registerPermit.global.regf) && (
            <Button
              variant='outlined'
              size='medium'
              color='primary'
              className={classes.button}
              onClick={(e) => {
                history.push('/register');
              }}
            >
              Register
            </Button>
          )}
        <Button
          size='medium'
          className={classes.button}
          onClick={(e) => {
            history.push('/');
          }}
        >
          Back to Login
        </Button>
      </div>
    );
  }
}
const ForgotGraphql = compose(
  withApollo,
  graphql(FORGOT),
  graphql(GET_DARK, { name: 'dark' }),
  graphql(CHANGE_DARK, { name: 'changeDark' }),
  graphql(GET_REGISTER_PERMIT, { name: 'registerPermit' })
)(Forgot);

export default withStyles(createStyles(styles))(ForgotGraphql);
