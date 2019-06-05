import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { Paper, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Dropdown, Table } from '../../components'

const styles = theme => ({
  paper: {
    width: '100%',
    padding: '0 20px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  input: {
    marginTop: '15px',
    width: '100%'
  },
  heading: {
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: '500'
  },
  button: {
    width: '100%',
    marginTop: '10px'
  },
  padded: {
    padding: '20px'
  }
})

class Questions extends React.Component {
  state = {
    columns: [
      { title: 'Number', field: 'name' },
      { title: 'Question Title', field: 'admin_id' }
    ],
    data: []
  }
  add = (newData, table) => {
    return new Promise((resolve, reject) => {
      resolve()
      let newstate = this.state
      newstate[table].data.push(newData)
      this.setState(newstate)

      // newstate[table].data.push(newData)
      // this.setState(newstate)
    })
  }
  update = (newData, oldData, table) => {
    return new Promise((resolve, reject) => {
      resolve()
      let newstate = this.state
      newstate[table].data[newstate[table].data.indexOf(oldData)] = newData
      this.setState(newstate)
    })
  }
  delete = (oldData, table) => {
    return new Promise((resolve, reject) => {
      resolve()
      let newstate = this.state
      newstate[table].data.splice(newstate[table].data.indexOf(oldData), 1)
      this.setState(newstate)
    })
  }

  componentWillUpdate (nextProps, nextState) {}
  render () {
    const { classes } = this.props
    return (
      <div>
        <div
          style={{
            display: 'flex'
          }}
          className={classes.padded}
        >
          <Paper className={classes.paper}>
            <Dropdown
              className={classes.input}
              options={[]}
              onChange={this.onDropdownChange}
              label='Branch'
              name='campus'
            />
            <Dropdown
              className={classes.input}
              options={[]}
              onChange={this.onDropdownChange}
              label='Course'
              name='campus'
            />
            <div className={classes.padded}>
              <Table
                onRowAdd={this.add}
                onRowDelete={this.delete}
                onRowUpdate={this.update}
                data={this.state.data}
                columns={this.state.columns}
                table=''
                title=''
                body={{ editRow: { deleteText: 'Remove the campus?' } }}
                style={{ boxShadow: 'none' }}
              />
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(Questions)
