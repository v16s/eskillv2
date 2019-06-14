import React, { Component } from 'react'
import { TextField, Paper, Button, Grid, Radio } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { Dropdown, PreviewCard } from './index'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  paper: {
    outline: 'none',
    width: '80%',
    maxWidth: 1000,
    padding: '30px',
    overflow: 'auto'
    
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
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  radio: { marginRight: '5px', width: '20px', height: '20px' },
  action: {width: '100%'}
}
const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: green[600]
    }
  },
  checked: {}
})(props => <Radio color='default' {...props} />)
const defaults = {
  name: '',
  desc: '',
  exp: '',
  options: {
    a: '',
    b: '',
    c: '',
    d: ''
  },
  picture: null,
  answer: ''
}
class NewQuestion extends Component {
  state = defaults
  onChange = pictures => this.setState({ pictures })
  handleRadioChange = (e, v) => {
    this.setState({ answer: e.target.value })
  }
  onInputChange = ({target}) => {
    let newstate = this.state
    newstate[target.name] = target.value
    this.setState(newstate)
  }
  onOptionInputChange = ({target}) => {
    let newstate = this.state
    newstate.options[target.name] = target.value
    this.setState(newstate)
  }
  checkQuestion = () => {
    let flag = true
    Object.keys(this.state).map(k => {
      if(this.state[k] == defaults[k]) {
        flag = false
      }
    })
    if(flag) {
      Object.keys(this.state.options).map(k => {
        if(this.state.options[k] == defaults.options[k]){
          flag = false
        }
      })
    }
    return flag
  }
  render () {
    const { answer } = this.state
    return (
      <Paper style={styles.paper}>
        <Grid container spacing={3} style={{height: 'auto'}}>
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
              placeholder='Question Name'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              name='name'
              onChange={this.onInputChange}
              value={this.state.name}
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
              name='desc'
              placeholder='Question Description with an equation: $ x^2+2x+4 $'
              onChange={this.onInputChange}
              value={this.state.desc}
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
              <GreenRadio
                inputProps={{ 'aria-label': 'Radio A' }}
                style={styles.radio}
                checked={answer === 'a'}
                onChange={this.handleRadioChange}
                value='a'
              />
            </div>
            <TextField
              label='Option A'
              placeholder='Option A'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              name='a'
              onChange={this.onOptionInputChange}
              value={this.state.options.a}
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
              <GreenRadio
                inputProps={{ 'aria-label': 'Radio A' }}
                style={styles.radio}
                checked={answer === 'b'}
                onChange={this.handleRadioChange}
                value='b'
              />
            </div>
            <TextField
              label='Option B'
              placeholder='Option B'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              name='b'
              onChange={this.onOptionInputChange}
              value={this.state.options.b}
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
              <GreenRadio
                inputProps={{ 'aria-label': 'Radio A' }}
                style={styles.radio}
                checked={answer === 'c'}
                onChange={this.handleRadioChange}
                value='c'
              />
            </div>
            <TextField
              label='Option C'
              placeholder='Option C'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              name='c'
              onChange={this.onOptionInputChange}
              value={this.state.options.c}
            />
          </Grid>
          <Grid style={styles.answer} item md={6}>
            <div style={styles.radioWrap}>
              <GreenRadio
                inputProps={{ 'aria-label': 'Radio A' }}
                style={styles.radio}
                checked={answer === 'd'}
                onChange={this.handleRadioChange}
                value='d'
              />
            </div>
            <TextField
              label='Option D'
              placeholder='Option D'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              name='d'
              onChange={this.onOptionInputChange}
              value={this.state.options.d}
            />
          </Grid>
          
          <Grid item md={12}>
            <input
              accept='image/*'
              style={{ display: 'none' }}
              id='raised-button-file'
              type='file'
            />
            <label htmlFor='raised-button-file'>
              <Button variant='contained' color='primary' component='span'>
                Upload
              </Button>
            </label>
          </Grid>
          <Grid item md={12}>
            <TextField
              label='Explanation'
              placeholder='Explanation for the question'
              type='text'
              margin='normal'
              variant='outlined'
              fullWidth
              multiline
              name='exp'
              onChange={this.onInputChange}
              value={this.state.exp}
            />
          </Grid>
          <Grid item md={12}>
            <PreviewCard {...this.state}></PreviewCard>
          </Grid>
          <Grid item md={6}>
            <Button variant='contained' onClick={this.props.close} style={styles.action}>Cancel</Button>
          </Grid>
          <Grid item md={6}>
          <Button style={styles.action} variant='contained' color='primary'>Submit</Button>
          </Grid>
          
        </Grid>
      </Paper>
    )
  }
}

export default NewQuestion
