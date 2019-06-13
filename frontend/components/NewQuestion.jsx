import React, { Component } from 'react'
import { TextField, Paper, Button, Grid, Radio } from '@material-ui/core'
import {green} from '@material-ui/core/colors'
import { Dropdown } from './index'
import { withStyles } from '@material-ui/core/styles';

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
    position: 'fixed'
  },
  answer: {
    display: 'flex'
  },
  radioWrap: {
    display: 'flex',
    flexDirection: "column",
    justifyContent:"center",
    height: "100%"
  },
  radio:{marginRight: '5px', width: '20px', height: '20px'}
}
const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);
class NewQuestion extends Component {
  state = {
    answer: '',
    pictures: {}
  }
  onChange = (pictures) => this.setState({pictures});
  handleRadioChange = (e, v) => {
    this.setState({answer: e.target.value})
  }
  render () {
    const { answer } = this.state
    return (
      <Paper style={styles.paper}>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <Dropdown
              options={[]}
              onChange={this.onDropdownChange}
              label='Branch'
              name='campus'
            />
          </Grid>
          <Grid item md={6}>
            <Dropdown
              options={[]}
              onChange={this.onDropdownChange}
              label='Course'
              name='campus'
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label='Question Name'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label='Question Description'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              multiline
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
            <GreenRadio
             inputProps={{ 'aria-label': 'Radio A' } }
             style={styles.radio}
              checked={answer === 'a'}
              onChange={this.handleRadioChange}
              value='a'
            /></div>
            <TextField
              label='Option A'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
            <GreenRadio
             inputProps={{ 'aria-label': 'Radio A' } }
             style={styles.radio}
              checked={answer === 'b'}
              onChange={this.handleRadioChange}
              value='b'
            /></div>
            <TextField
              label='Option B'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
            <GreenRadio
             inputProps={{ 'aria-label': 'Radio A' } }
             style={styles.radio}
              checked={answer === 'c'}
              onChange={this.handleRadioChange}
              value='c'
            /></div>
            <TextField
              label='Option C'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
            <GreenRadio
             inputProps={{ 'aria-label': 'Radio A' } }
             style={styles.radio}
              checked={answer === 'd'}
              onChange={this.handleRadioChange}
              value='d'
            /></div>
            <TextField
              label='Option D'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
          <input
  accept="image/*"
  style={{ display: 'none' }}
  id="raised-button-file"
  type="file"
/>
<label htmlFor="raised-button-file">
  <Button  component="span">
    Upload
  </Button>
</label> 
          </Grid>
          <Grid item md={12}>
            <TextField
              label='Hints'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default NewQuestion
