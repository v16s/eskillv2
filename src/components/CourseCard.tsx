import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { withStyles, createStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import {
  Card,
  Grid,
  Typography,
  LinearProgress,
  CardMedia,
  CardActionArea,
  CardHeader,
  CardContent,
} from '@material-ui/core';
const styles = (theme) => ({
  cardcontent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '75%',
    padding: 10,
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: '15px 0',
  },
  card: {
    height: '100%',
    maxWidth: '350px',
  },
  griditem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
class CourseCardBase extends Component<any, any> {
  render() {
    const {
      classes,
      course,
      complete,
      completed,
      theme,
      correct,
      history: { push },
    } = this.props;

    return (
      <Grid className={classes.griditem} item md={3} lg={2} sm={4} xs={12}>
        <Card className={classes.card}>
          <CardActionArea
            onClick={(e) => {
              e.preventDefault();
              push(`/course/${this.props.id}`);
            }}
            style={{ height: '100%' }}
          >
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
                  })}
                />
              </div>
              <div className={classes.column}>
                <Typography variant='caption'>
                  {completed} questions completed
                </Typography>
                <Typography variant='caption'>
                  {correct} questions correctly answered
                </Typography>
                {/* <Typography variant='caption'>
                  {correct} Answered Correctly
                </Typography> */}
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}

export const CourseCard = withRouter(
  withStyles(createStyles(styles), { withTheme: true })(CourseCardBase)
);
