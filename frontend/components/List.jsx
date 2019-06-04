import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Grid,
  Typography
} from '@material-ui/core/'
import {
  
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    paddingLeft: '5px'
  }
}))

export default ({ title, data }) => {
  const classes = useStyles()
  return (
    <div style={{width: '100%', padding: '10px'}}>
      <Typography variant='h6' className={classes.title}>
        {title}
      </Typography>
      <div className={classes.demo}>
        <List>
          {data.map(d => (
            <ListItem>
            <IconButton edge='start' aria-label='Edit'>
                  <EditIcon />
                </IconButton>
              <ListItemText primary={d} />
              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='Delete'>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
      </div>
  )
}
