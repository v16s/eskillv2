import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { useWindowSize } from '../util'
import gql from 'graphql-tag'
import {
  Paper,
  Radio,
  Button,
  Grid,
  Toolbar,
  Typography
} from '@material-ui/core'
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp as ArrowBack
} from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
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

export const QuestionView = ({
  status,
  ans,
  name,
  desc,
  exp,
  display,
  question,
  classes,
  course,
  questions,
  last,
  position,
  opt,
  refetch,
  close
}) => {
  const history = useHistory()
  const [updateAnswer, _d] = useMutation(OPTION_UPDATE)
  const [check, _d2] = useMutation(VERIFY_QUESTION)
  const [correct, setCorrect] = useState('correct')
  const [fetchAnswer, { data, called, loading }] = useLazyQuery(FETCH_ANSWER)
  const [answer, setAnswer] = useState(ans)
  const disabled = status != 0
  const size = useWindowSize()
  useEffect(() => {
    if (called && !loading) {
      setCorrect(data.question.ans)
    }
    if (correct == 'correct' && status == 1) {
      updateWithAnswer()
    }
  }, [])
  const handleRadioChange = (e, v) => {
    if (status == 0) {
      let _answer = e
      updateAnswer({
        variables: { question, name: course, answer: _answer }
      })
        .then(({ data }) => {
          setAnswer(_answer)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const onSubmit = () => {
    if (answer != '') {
      check({ variables: { question, name: course } })
        .then(({ data }) => {
          refetch()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const getClass = (status, classes) => {
    if (status == 0) {
      return classes.primary
    } else if (status == 1) {
      return classes.red
    } else {
      return classes.green
    }
  }
  const isCorrect = value => {
    if (value == correct) return classes.green
    else return classes.grey
  }
  const updateWithAnswer = () => {
    fetchAnswer({
      variables: { id: question }
    })
  }
  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography className={classes.appBar} variant='h6' noWrap>
            <Latex>Question</Latex>
          </Typography>
          <Button
            variant='contained'
            className={classes.danger}
            onClick={close}
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
                checked={answer === 'a'}
                onClick={(e, v) => {
                  handleRadioChange(
                    e.currentTarget.querySelector('input').value
                  )
                }}
                value='a'
                name='a'
              />
            </div>
            <Paper
              className={` ${classes.radiopaper} ${
                answer === 'a' ? getClass(status, classes) : isCorrect('a')
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
                inputProps={{ 'aria-label': 'Radio B' }}
                checked={answer === 'b'}
                onClick={(e, v) => {
                  handleRadioChange(
                    e.currentTarget.querySelector('input').value
                  )
                }}
                value='b'
              />
            </div>
            <Paper
              className={` ${classes.radiopaper} ${
                answer === 'b' ? getClass(status, classes) : isCorrect('b')
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
                inputProps={{ 'aria-label': 'Radio C' }}
                checked={answer === 'c'}
                onClick={(e, v) => {
                  handleRadioChange(
                    e.currentTarget.querySelector('input').value
                  )
                }}
                value='c'
              />
            </div>
            <Paper
              className={` ${classes.radiopaper} ${
                answer === 'c' ? getClass(status, classes) : isCorrect('c')
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
                inputProps={{ 'aria-label': 'Radio D' }}
                checked={answer === 'd'}
                onClick={(e, v) => {
                  handleRadioChange(
                    e.currentTarget.querySelector('input').value
                  )
                }}
                value='d'
              />
            </div>
            <Paper
              className={` ${classes.radiopaper}  ${
                answer === 'd' ? getClass(status, classes) : isCorrect('d')
              }`}
            >
              {opt.d}
            </Paper>
          </Grid>
        </Grid>
        {disabled && (
          <Grid spacing={3} container style={{ height: 'auto', padding: 30 }}>
            <Grid item xs={12}>
              <Typography variant='body1'>
                <Latex>{exp}</Latex>
              </Typography>
            </Grid>
          </Grid>
        )}
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
            onClick={onSubmit}
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
                history.push(`/course/${course}/${questions[position - 1].id}`)
              }
            >
              {size.width < 768 ? <KeyboardArrowLeft /> : 'PREVIOUS QUESTION'}
            </Button>
          </Grid>
          <Grid className={classes.griditem} item xs={4} md={4} xl={4}>
            <Button onClick={e => history.push(`/course/${course}`)}>
              {size.width < 768 ? <ArrowBack /> : 'BACK'}
            </Button>
          </Grid>
          <Grid className={classes.griditem} item xs={4} md={4} xl={4}>
            <Button
              disabled={position == last}
              onClick={e =>
                history.push(`/course/${course}/${questions[position + 1].id}`)
              }
            >
              {size.width < 768 ? <KeyboardArrowRight /> : 'NEXT QUESTION'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
