import React, { Component } from 'react'
import { Paper, TextField, Grid, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { Dropdown } from './index'
export default withStyles(theme => ({
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
}))(
  class ReportProblem extends Component {
    state = {
      option: {},
      problem: ''
    }
    onDropdownChange = option => {
      this.setState({ option })
    }
    onInputChange = ({ target: { value } }) => {
      this.setState({ problem: value })
    }
    render () {
      const { classes } = this.props
      const { option } = this.state
      return (
        <Paper className={classes.paper}>
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
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )
    }
  }
)
