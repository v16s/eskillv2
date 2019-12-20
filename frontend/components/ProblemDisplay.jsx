import React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelActions,
  Button,
  Divider,
  Chip
} from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme =>
  createStyles({
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
      color: theme.palette.text.secondary,
      display: 'flex',
      alignItems: 'center'
    },
    approved: {
      backgroundColor: '#00ffa5',
      color: theme.palette.grey[700]
    },
    pending: {
      color: theme.palette.grey[700],
      backgroundColor: '#eeff00'
    },
    expansionPanel: {
      backgroundColor:
        theme.palette.type == 'dark'
          ? theme.palette.grey[700]
          : theme.palette.grey[200]
    },
    chip: {
      marginRight: 15
    }
  })
)

export const ProblemDisplay = ({ description, status, idx }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(null)
  const handleChange = idx => {
    if (expanded == idx) {
      setExpanded(null)
    } else {
      setExpanded(idx)
    }
  }
  status = parseInt(status)
  const statusValue = {
    label:
      status > 0 ? 'Approved' : status < 0 ? 'Rejected' : 'Pending Approval',
    className:
      status > 0 ? classes.approved : status == 0 ? classes.pending : undefined,
    color: status < 0 ? 'secondary' : undefined
  }
  console.log(statusValue.label, status)
  return (
    <ExpansionPanel
      className={classes.expansionPanel}
      expanded={expanded === idx}
      onChange={e => handleChange(idx)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1bh-content'
        id='panel1bh-header'
      >
        <Chip
          label={statusValue.label}
          color={statusValue.color}
          className={`${classes.chip} ${statusValue.className}`}
        ></Chip>

        <Typography className={classes.secondaryHeading}>
          {description.length < 20
            ? description
            : expanded === idx
            ? ''
            : `${description.slice(0, 20)}...`}
        </Typography>
      </ExpansionPanelSummary>
      {description.length > 20 && (
        <ExpansionPanelDetails>
          <Typography>{description}</Typography>
        </ExpansionPanelDetails>
      )}
      <Divider />
      <ExpansionPanelActions>
        <Button size='small' color='secondary' variant='contained'>
          Reject
        </Button>
        <Button size='small' className={classes.approved} variant='contained'>
          Resolve
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  )
}
