import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Paper, TextField, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 30,
    maxWidth: 500,
    width: '100%',
    marginTop: 15,
    '& > *:not(:first-child)': {
      marginTop: 15,
    },
  },
  toast: {
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 200,
    padding: 5,
  },
}));

const RESET = gql`
  mutation Reset($username: String!, $password: String!) {
    resetPassword(username: $username, password: $password) {
      username
    }
  }
`;

export default ({ noshadow }) => {
  const [reset, { data }] = useMutation(RESET);
  const [error, setError] = React.useState<string | null>(null);
  const [values, handleChange] = React.useReducer(
    (_values, e) => ({ ..._values, [e.target.name]: e.target.value }),
    { username: '', password: '', confirm: '' }
  );
  const classes = useStyles();
  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    setError(null);
    if (values.password == values.confirm) {
      reset({
        variables: { username: values.username, password: values.password },
      }).catch((e) => {
        console.log(e);
        setError(e.toString());
      });
    }
  }, []);
  const Toast = ({ error, children }) => (
    <div
      style={
        error ? { backgroundColor: '#ffaaaa' } : { backgroundColor: '#93ffa7' }
      }
      className={classes.toast}
    >
      {error ? children : 'Success'}
    </div>
  );
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Paper
        className={classes.root}
        style={noshadow ? { boxShadow: 'none' } : undefined}
      >
        {' '}
        <TextField
          variant='outlined'
          value={values.username}
          onChange={(e) => {
            e.persist();
            handleChange(e);
          }}
          label='Username'
          name='username'
        />
        <TextField
          variant='outlined'
          label='Password'
          type='password'
          name='password'
          value={values.password}
          onChange={(e) => {
            e.persist();
            handleChange(e);
          }}
        />
        <TextField
          variant='outlined'
          label='Confirm Password'
          type='password'
          name='confirm'
          value={values.confirm}
          error={
            values.confirm !== values.password &&
            values.confirm !== '' &&
            values.password !== ''
          }
          helperText={
            values.confirm !== values.password &&
            values.confirm !== '' &&
            values.password !== ''
              ? `Passwords don't Match`
              : ''
          }
          onChange={(e) => {
            e.persist();
            handleChange(e);
          }}
        />
        {!data && !error ? null : error ? (
          <Toast error>{error}</Toast>
        ) : (
          <Toast error={null}>{null}</Toast>
        )}
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Reset Password
        </Button>
      </Paper>
    </form>
  );
};
