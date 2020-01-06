import React, { Component } from 'react'
import { Paper, TextField, Grid, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { Dropdown } from './index'
import gql from 'graphql-tag'
import { graphql } from '@apollo/react-hoc'

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
`

const styles = theme => ({
  paper: {
    padding: 20,
    width: '95%',
    maxWidth: '400px'
  },
  textField: {
    width: '100%'
  },
  grid: {
    marginTop: 15
  },
  button: {
    width: '100%'
  }
})

class ReportProblemBase extends Component {
  state = {
    option: {},
    problem: ''
  }
  onDropdownChange = option => {
    let value = option.label
    if (option.label == 'Custom') {
      value = ''
    }
    this.setState({ option, problem: value })
  }
  onInputChange = ({ target: { value } }) => {
    this.setState({ problem: value })
  }
  submit = () => {
    const { course, question } = this.props
    console.log(this.state.problem)
    if (this.state.problem != '') {
      this.props
        .mutate({
          variables: {
            queID: question,
            course,
            description: this.state.problem
          }
        })
        .then(data => {
          this.props.close()
        })
        .catch(err => {
          // write a handler here
        })
    }
  }
  render () {
    const { classes, question, course } = this.props
    const { option } = this.state
    console.log(question, course)
    return (
      <Paper tabIndex={-1} className={classes.paper}>
        <Dropdown
          options={[
            { label: 'Question Description is not defined', value: 1 },
            { label: 'Question Description is not correct', value: 2 },
            { label: 'Options are not defined', value: 3 },
            { label: 'None of the options are correct', value: 4 },
            { label: 'Error with displaying the question', value: 5 },
            { label: 'Custom', value: 0 }
          ]}
          onChange={this.onDropdownChange}
          label='Select a reason'
          name='Reason'
        />
        {option.value == 0 && (
          <TextField
            id='outlined-textarea'
            label='Custom Problem'
            placeholder='Define your problem here'
            multiline
            className={classes.textField}
            margin='normal'
            variant='outlined'
            onChange={this.onInputChange}
          />
        )}
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={6}>
            <Button className={classes.button} onClick={this.props.close}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={this.submit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}
ReportProblemBase = withStyles(styles)(ReportProblemBase)
export const ReportProblem = graphql(CREATE_PROBLEM)(ReportProblemBase)
