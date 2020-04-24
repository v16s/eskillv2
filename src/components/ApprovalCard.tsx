import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'
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
    justifyContent: 'center'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: '15px 0'
  },
  card: {
    maxWidth: '350px',
    width: '100%',
    height: '100%',
    minHeight: 300
  },
  griditem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  }
})
class CourseCard extends Component {
  render () {
    const {
      classes,
      course,
      complete,
      completed,
      theme,
      history: { push }
    } = this.props

    return (
      <Grid className={classes.griditem} item md={3} lg={2} sm={4} xs={12}>
        <Card className={classes.card}>
          <CardHeader title={course} style={{ textAlign: 'center' }} />

          <CardContent className={classes.cardcontent}>
            Awaiting Approval
          </CardContent>
        </Card>
      </Grid>
    )
  }
}

export const ApprovalCard = withRouter(
  withStyles(styles, { withTheme: true })(CourseCard)
)
