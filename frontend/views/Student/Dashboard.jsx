import React from 'react'
import { Table, RegisterControl } from '../../components'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withStyles } from "@material-ui/core";

const styles = theme => ({
    root: {
        display: 'flex',
        color: '#fff'
    }
})

class Dashboard extends React.Component {
  render () {
      const classes = this.props
    return (
      <div>
        <div
          className={classes.root}
        >
                Student dashboard
                  </div>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
