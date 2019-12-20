import React, { Component } from 'react'
import { graphql } from '@apollo/react-hoc'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/styles'
import { ProblemDisplay } from '../components'
const PROBLEMS = gql`
  {
    problems {
      description
      studID
      status
      queID
    }
  }
`
const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
    padding: '30px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  expansionPanel: {
    backgroundColor:
      theme.palette.type == 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[200]
  }
})

class Problems extends Component {
  state = {
    expanded: null
  }
  handleChange = expanded => {
    if (this.state.expanded == expanded) {
      expanded = null
    }
    this.setState({ expanded })
  }
  render () {
    const { classes, data } = this.props
    const { expanded } = this.state
    const { loading, problems } = data
    console.log(loading, problems)
    return (
      <div className={classes.root}>
        {!loading &&
          problems.map((d, idx) => (
            <ProblemDisplay key={idx} idx={idx} {...d}></ProblemDisplay>
          ))}
      </div>
    )
  }
}
Problems = graphql(PROBLEMS)(Problems)
export default withStyles(styles)(Problems)
