import React, { Component } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Paper,
  AppBar,
  Radio,
  Button,
  Grid,
  Modal,
  Toolbar,
  Typography
} from '@material-ui/core'
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp as ArrowBack
} from '@material-ui/icons'
import { history } from '../util'
import Latex from 'react-latex'

const OPTION_UPDATE = gql`
  mutation OptionUpdate($question: String!, $name: String!, $answer: String!) {
    updateQuestionInstance(question: $question, cid: $name, answer: $answer) {
      course
    }
  }
`
const VERIFY_QUESTION = gql`
  mutation VerifyQuestion($question: String!, $name: String!) {
    verifyQuestion(question: $question, cid: $name) {
      course
    }
  }
`
const FETCH_ANSWER = gql`
  query Question($id: String!) {
    question(id: $id) {
      ans
    }
  }
`

class QuestionView extends Component {
  state = {
    answer: this.props.ans,
    correct: 'correct'
  }
  handleRadioChange = (e, v) => {
    if (this.props.status == 0) {
      let answer = e.target.value
      let { question, course } = this.props
      this.props
        .updateAnswer({
          variables: { question, name: course, answer }
        })
        .then(({ data }) => {
          this.setState({ answer })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  onSubmit = () => {
    let { question, course } = this.props
    this.props
      .check({ variables: { question, name: course } })
      .then(({ data }) => {
        this.props.refetch()
      })
      .catch(err => {
        console.log(err)
      })
  }
  getClass = (status, classes) => {
    if (status == 0) {
      return classes.primary
    } else if (status == 1) {
      return classes.red
    } else {
      return classes.green
    }
  }
  isCorrect = value => {
    if (value == this.state.correct) return this.props.classes.green
    else return ''
  }
  componentDidMount () {
    const { client } = this.props
    if (this.state.correct == 'correct') {
      if (this.props.status == 1) {
        client
          .query({
            query: FETCH_ANSWER,
            variables: { id: this.props.question }
          })
          .then(({ data: { question } }) => {
            console.log(question)
            this.setState({ correct: question.ans })
          })
          .catch(err => {})
      }
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    const { client } = this.props
    if (nextState.correct == 'correct') {
      if (nextProps.status == 1) {
        return new Promise((resolve, reject) => {
          client
            .query({
              query: FETCH_ANSWER,
              variables: { id: nextProps.question }
            })
            .then(({ data: { question } }) => {
              console.log(question)
              nextState.correct = question.ans
              resolve(true)
            })
            .catch(err => {
              resolve(true)
            })
        })
      }
    }
    return true
  }

  render () {
    const {
      status,
      ans,
      name,
      desc,
      exp,
      display,
      classes,
      course,
      questions,
      last,
      position,
      opt
    } = this.props
    const disabled = status != 0
    const { answer } = this.state
    return (
      <div>
        <Paper className={classes.paper}>
          <Toolbar>
            <Typography className={classes.appBar} variant='h6' noWrap>
              <Latex>{name}</Latex>
            </Typography>
            <Button
              variant='contained'
              className={classes.danger}
              onClick={this.props.close}
            >
              Report
            </Button>
          </Toolbar>
          <Grid spacing={3} container style={{ height: 'auto', padding: 30 }}>
            <Grid item xs={12}>
              <Typography variant='body1'>
                <Latex>{desc}</Latex>
              </Typography>
              {display && (
                <img
                  src={display}
                  style={{
                    maxHeight: '500px',
                    maxWidth: '500px'
                  }}
                  alt=''
                />
              )}
            </Grid>
            <Grid className={classes.answer} item xs={12} sm={6}>
              <div className={classes.radioWrap}>
                <Radio
                  disabled={disabled}
                  color='primary'
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'a'}
                  onChange={this.handleRadioChange}
                  value='a'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper} ${this.isCorrect('a')}  ${
                  answer === 'a' ? this.getClass(status, classes) : classes.grey
                }`}
              >
                <Latex>{opt.a}</Latex>
              </Paper>
            </Grid>
            <Grid className={classes.answer} item xs={12} sm={6}>
              <div className={classes.radioWrap}>
                <Radio
                  disabled={disabled}
                  color='primary'
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'b'}
                  onChange={this.handleRadioChange}
                  value='b'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper} ${this.isCorrect('b')}  ${
                  answer === 'b' ? this.getClass(status, classes) : classes.grey
                }`}
              >
                {opt.b}
              </Paper>
            </Grid>
            <Grid className={classes.answer} item xs={12} sm={6}>
              <div className={classes.radioWrap}>
                <Radio
                  disabled={disabled}
                  color='primary'
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'c'}
                  onChange={this.handleRadioChange}
                  value='c'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper} ${this.isCorrect('c')}  ${
                  answer === 'c' ? this.getClass(status, classes) : classes.grey
                }`}
              >
                {opt.c}
              </Paper>
            </Grid>
            <Grid className={classes.answer} item xs={12} sm={6}>
              <div className={classes.radioWrap}>
                <Radio
                  disabled={disabled}
                  color='primary'
                  inputProps={{ 'aria-label': 'Radio A' }}
                  className={classes.radio}
                  checked={answer === 'd'}
                  onChange={this.handleRadioChange}
                  value='d'
                />
              </div>
              <Paper
                className={` ${classes.radiopaper} ${this.isCorrect('d')}  ${
                  answer === 'd' ? this.getClass(status, classes) : classes.grey
                }`}
              >
                {opt.d}
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
              onClick={this.onSubmit}
              size='large'
              disabled={disabled}
            >
              Submit
            </Button>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container style={{ height: 'auto' }} spacing={3}>
            <Grid className={classes.griditem} item xs={4} md={4} xl={4}>
              <Button
                disabled={position == 0}
                onClick={e =>
                  history.push(
                    `/course/${course}/${questions[position - 1].id}`
                  )
                }
              >
                <KeyboardArrowLeft />
              </Button>
            </Grid>
            <Grid className={classes.griditem} item xs={4} md={4} xl={4}>
              <Button onClick={e => history.push(`/course/${course}`)}>
                <ArrowBack />
              </Button>
            </Grid>
            <Grid className={classes.griditem} item xs={4} md={4} xl={4}>
              <Button
                disabled={position == last}
                onClick={e =>
                  history.push(
                    `/course/${course}/${questions[position + 1].id}`
                  )
                }
              >
                <KeyboardArrowRight />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}
export default compose(
  withApollo,
  graphql(VERIFY_QUESTION, { name: 'check' }),
  graphql(OPTION_UPDATE, { name: 'updateAnswer' })
)(QuestionView)