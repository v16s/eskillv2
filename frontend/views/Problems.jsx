import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/styles'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelActions,
  Button,
  Divider
} from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
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
    return (
      <div className={classes.root}>
        {!loading &&
          problems.map((d, idx) => (
            <ExpansionPanel
              key={idx}
              className={classes.expansionPanel}
              expanded={expanded === idx}
              onChange={e => this.handleChange(idx)}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1bh-content'
                id='panel1bh-header'
              >
                <Typography className={classes.heading}>{d.status}</Typography>
                <Typography className={classes.secondaryHeading}>
                  {d.description.length < 20
                    ? d.description
                    : expanded === idx
                      ? ''
                      : `${d.description.slice(0, 20)}...`}
                </Typography>
              </ExpansionPanelSummary>
              {d.description.length > 20 && (
                <ExpansionPanelDetails>
                  <Typography>{d.description}</Typography>
                </ExpansionPanelDetails>
              )}
              <Divider />
              <ExpansionPanelActions>
                <Button size='small' color='secondary' variant='contained'>
                  Reject
                </Button>
                <Button size='small' color='primary' variant='contained'>
                  Resolve
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          ))}
      </div>
    )
  }
}
Problems = graphql(PROBLEMS)(Problems)
export default withStyles(styles)(Problems)
