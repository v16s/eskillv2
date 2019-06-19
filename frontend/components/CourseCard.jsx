import React, { Component } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { withStyles } from '@material-ui/styles'
import 'react-circular-progressbar/dist/styles.css'
import {
  Card,
  Grid,
  Typography,
  LinearProgress,
  CardMedia,
  CardActionArea,
  CardHeader,
  CardContent
} from '@material-ui/core'
const styles = theme => ({
  cardcontent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '75%',
    padding: 10,
    justifyContent: 'space-between'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: '15px 0'
  }
})
class CourseCard extends Component {
  render () {
    const { classes, course, complete, correct, theme } = this.props

    return (
      <Grid item md={3} lg={2} sm={4} xs={12}>
        <Card>
          <CardActionArea style={{ height: '100%' }}>
            <CardHeader title={course} style={{ textAlign: 'center' }} />

            <CardContent className={classes.cardcontent}>
              <div />
              <div className={classes.column}>
                <CircularProgressbar
                  value={complete}
                  text={`${complete}%`}
                  styles={buildStyles({
                    textColor: theme.palette.text.primary,
                    pathColor: theme.palette.primary.main,
                    trailColor: theme.palette.background.default,
                    textSize: '12px',
                    strokeLinecap: 'butt',
                    maxWidth: '300px'
                  })}
                />
              </div>
              <div className={classes.column}>
                <Typography variant='caption'>
                  {complete} Questions Attempted
                </Typography>
                <Typography variant='caption'>
                  {correct} Answered Correctly
                </Typography>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CourseCard)
