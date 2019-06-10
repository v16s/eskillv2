import React, { Component } from 'react'
import { TextField, Paper, Typography } from '@material-ui/core'
const styles = {
  paper: {
    outline: 'none',
    width: '80%',
    maxWidth: 1000,
    padding: '30px'
  },
  container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      position:'fixed'
  }
}
class NewQuestion extends Component {
  render () {
    return (

      <Paper style={styles.paper}>
        <Typography variant='h6' id='modal-title'>
          Text in a modal
        </Typography>
        <Typography variant='subtitle1' id='simple-modal-description'>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
        <Typography variant='h6' id='modal-title'>
          Text in a modal
        </Typography>
        <Typography variant='subtitle1' id='simple-modal-description'>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Paper>

    )
  }
}

export default NewQuestion
