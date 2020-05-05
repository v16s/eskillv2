import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Dropdown } from './index';
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { useMutation } from '@apollo/react-hooks';

const CREATE_PROBLEM = gql`
  mutation CreateProblem(
    $queID: String!
    $course: String!
    $description: String!
  ) {
    createProblem(queID: $queID, course: $course, description: $description) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    width: '95%',
    maxWidth: '400px',
  },
  textField: {
    width: '100%',
  },
  grid: {
    marginTop: 15,
  },
  button: {
    width: '100%',
  },
}));

export const ReportProblem = ({ course, question, close }) => {
  const [option, setOption] = React.useState<number | null>(null);
  const [problem, setProblem] = React.useState('');
  const [mutate] = useMutation(CREATE_PROBLEM);
  const classes = useStyles();

  function onDropdownChange(opt) {
    setOption(opt.value);
    setProblem(opt.label);
  }
  function onInputChange(e) {
    setProblem(e.target.value);
  }
  function submit() {
    if (problem != '') {
      mutate({
        variables: {
          queID: question,
          course,
          description: problem,
        },
      });
      close();
    }
  }
  return (
    <Paper tabIndex={-1} className={classes.paper}>
      <Dropdown
        options={[
          { label: 'Question Description is not defined', value: 1 },
          { label: 'Question Description is not correct', value: 2 },
          { label: 'Options are not defined', value: 3 },
          { label: 'None of the options are correct', value: 4 },
          { label: 'Error with displaying the question', value: 5 },
          { label: 'Custom', value: 0 },
        ]}
        onChange={onDropdownChange}
        label='Select a reason'
        name='Reason'
      />
      {option == 0 && (
        <TextField
          id='outlined-textarea'
          label='Custom Problem'
          placeholder='Define your problem here'
          multiline
          className={classes.textField}
          margin='normal'
          variant='outlined'
          onChange={onInputChange}
        />
      )}
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={6}>
          <Button className={classes.button} onClick={close}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            onClick={submit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
