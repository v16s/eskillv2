import React, { Component } from 'react'
import {
  Paper,
  AppBar,
  Radio,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core'
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  HomeRounded
} from '@material-ui/icons'
import { withStyles } from '@material-ui/styles'
import { red, green } from '@material-ui/core/colors'
import Latex from 'react-latex'

const GreenRadio = withStyles(theme => ({
  root: {
    '&$checked': {
      color: green[400]
    }
  },
  checked: {}
}))(props => <Radio color='default' {...props} />)

const styles = ({ palette }) => ({
  griditem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  paper: {
    margin: '20px 0'
  },
  danger: {
    color: '#fff',
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[600]
    }
  },
  answer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '5px 0'
  },
  radioWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  radiopaper: {
    flexGrow: '1',
    marginLeft: '15px',
    padding: '10px'
  },
  grey: {
    backgroundColor:
      palette.type == 'dark' ? palette.grey[700] : palette.grey[200]
  },
  green: {
    backgroundColor: green[400]
  }
})
class QuestionView extends Component {
  state = { answer: '' }
  handleRadioChange = (e, v) => {
    this.setState({ answer: e.target.value })
  }
  render () {
    let { classes } = this.props
    const { answer } = this.state
    return (
      <div>
        <Paper className={classes.paper}>
          <Toolbar>
            <Typography className={classes.appBar} variant='h6' noWrap>
              Question Title
            </Typography>
            <Button variant='contained' className={classes.danger}>
              Report
            </Button>
          </Toolbar>
          <Grid spacing={3} container style={{ height: 'auto', padding: 30 }}>
            <Grid item md={12}>
              <Typography variant='h6'>
                {' '}
                <Latex>Question Title</Latex>
              </Typography>
              <Typography variant='body1'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas sollicitudin, urna vel eleifend viverra, nisl arcu
                tempus ex, nec commodo tellus ligula quis odio. Pellentesque
                posuere orci lacus. Nullam fermentum, urna in volutpat cursus,
                libero orci euismod lorem, a efficitur sapien elit at velit.
                Duis vel nunc vitae lorem vulputate accumsan. Donec vestibulum
                aliquam aliquet. Sed at massa dignissim eros elementum feugiat.
                Pellentesque volutpat nulla elit, a vestibulum lorem gravida a.
                Mauris ac malesuada turpis. Aenean tincidunt mollis elit, id
                hendrerit justo fermentum at. Curabitur aliquam elit in diam
                eleifend, ut mollis eros commodo. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
              </Typography>
            </Grid>
            <Grid className={classes.answer} item sm={6}>
              <div className={classes.radioWrap}>
                <GreenRadio
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'a'}
                  onChange={this.handleRadioChange}
                  value='a'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper}  ${
                  answer === 'a' ? classes.green : classes.grey
                }`}
              >
                asdasdasd
              </Paper>
            </Grid>
            <Grid className={classes.answer} item sm={6}>
              <div className={classes.radioWrap}>
                <GreenRadio
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'b'}
                  onChange={this.handleRadioChange}
                  value='b'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper}  ${
                  answer === 'b' ? classes.green : classes.grey
                }`}
              >
                asdasdasd
              </Paper>
            </Grid>
            <Grid className={classes.answer} item sm={6}>
              <div className={classes.radioWrap}>
                <GreenRadio
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'c'}
                  onChange={this.handleRadioChange}
                  value='c'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper}  ${
                  answer === 'c' ? classes.green : classes.grey
                }`}
              >
                asdasdasd
              </Paper>
            </Grid>
            <Grid className={classes.answer} item sm={6}>
              <div className={classes.radioWrap}>
                <GreenRadio
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'd'}
                  onChange={this.handleRadioChange}
                  value='d'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper}  ${
                  answer === 'd' ? classes.green : classes.grey
                }`}
              >
                asdasdasd
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              style={{
                width: '100%',
                boxShadow: 'none',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
              }}
              size='large'
            >
              Submit
            </Button>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container style={{ height: 'auto' }} spacing={3}>
            <Grid className={classes.griditem} item md={4}>
              <Button>
                <KeyboardArrowLeft />
              </Button>
            </Grid>
            <Grid className={classes.griditem} item md={4}>
              <Button>
                <HomeRounded />
              </Button>
            </Grid>
            <Grid className={classes.griditem} item md={4}>
              <Button>
                <KeyboardArrowRight />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(QuestionView)
