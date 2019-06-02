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
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  }
}))

export default ({ title, data }) => {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={6}>
      <Typography variant='h6' className={classes.title}>
        {title}
      </Typography>
      <div className={classes.demo}>
        <List>
          {data.map(d => (
            <ListItem>
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
    </Grid>
  )
}
