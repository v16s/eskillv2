import React, { Component } from 'react'
import { graphql } from '@apollo/react-hoc'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/styles'
import { ProblemDisplay } from '../components'
const PROBLEMS = gql`
  {
    problems {
      description
      id
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
  render () {
    const { classes, data } = this.props
    const { loading, problems, refetch } = data
    console.log(loading, problems)
    return (
      <div className={classes.root}>
        {!loading &&
          problems.map((d, idx) => {
            console.log(d)
            return (
              <ProblemDisplay
                mutations={this.props.mutations}
                key={idx}
                idx={idx}
                refetch={refetch}
                {...d}
              ></ProblemDisplay>
            )
          })}
      </div>
    )
  }
}
Problems = graphql(PROBLEMS)(Problems)
Problems = withStyles(styles)(Problems)
export { Problems }
