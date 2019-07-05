import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
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
    const { classes } = this.props
    const { expanded } = this.state
    return (
      <div className={classes.root}>
        {[
          { title: 'C Programming', desc: 'problem desc here' },
          { title: 'C Programming', desc: 'problem desc here' },
          { title: 'C Programming', desc: 'problem desc here' },
          { title: 'C Programming', desc: 'problem desc here' }
        ].map((d, idx) => (
          <ExpansionPanel
            className={classes.expansionPanel}
            expanded={expanded === idx}
            onChange={e => this.handleChange(idx)}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1bh-content'
              id='panel1bh-header'
            >
              <Typography className={classes.heading}>{d.title}</Typography>
              <Typography className={classes.secondaryHeading}>
                {d.desc.length < 20
                  ? d.desc
                  : expanded === idx
                    ? ''
                    : `${d.desc.slice(0, 20)}...`}
              </Typography>
            </ExpansionPanelSummary>
            {d.desc.length > 20 && (
              <ExpansionPanelDetails>
                <Typography>{d.desc}</Typography>
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

export default withStyles(styles)(Problems)
