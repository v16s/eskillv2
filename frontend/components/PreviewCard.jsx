import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Grid, Paper } from '@material-ui/core'
import Latex from 'react-latex'

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
      padding: 20
  }
})

export default function SimpleCard ({ name, desc, options: { a, b, c, d }, answer, exp }) {
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          className={classes.title}
          color='textSecondary'
          gutterBottom
        >
          Question Preview
        </Typography>
        <Typography variant='h5' component='h2'>
          <Latex>{name == '' ? 'Question Name' : name}</Latex>
        </Typography>
        <Typography variant='body2' component='p'>
          <Latex>{desc == '' ? 'Question Description with an equation: $ x^2+2x+4 $' : desc}</Latex>
        </Typography>
        <Grid container spacing={3} style={{marginTop: '15px'}}>
          <Grid item md={6}>
            <Paper className={classes.paper} style={{backgroundColor: answer == 'a' && 'green'}}>
              <Latex>{a == '' ? 'Option A' : a}</Latex>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className={classes.paper} style={{backgroundColor: answer == 'b' && 'green'}}>
              <Latex>{b == '' ? 'Option B' : b}</Latex>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className={classes.paper} style={{backgroundColor: answer == 'c' && 'green'}}>
              <Latex>{c == '' ? 'Option C' : c}</Latex>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className={classes.paper} style={{backgroundColor: answer == 'd' && 'green'}}>
              <Latex>{d == '' ? 'Option D' : d}</Latex>
            </Paper>
          </Grid>
        </Grid>
        <Paper className={classes.paper} style={{marginTop: '15px'}}>
        <Typography variant='body2' component='p'>
          <Latex>{exp == '' ? 'Explanation for the question' : exp}</Latex>
        </Typography>
        </Paper>
      </CardContent>
    </Card>
  )
}
