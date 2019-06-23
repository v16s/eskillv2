import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AppBar } from '../../components'
import Dashboard from './Dashboard'
import CourseQuestions from './CourseQuestions'
import Question from './Question'
import { ReportProblem } from '../../components'
export default class Student extends React.Component {
  render () {
    return (
      <div
        style={{
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        <AppBar />
        <Switch>
          <Route path='/report' component={ReportProblem} />
          <Route path='/course/:name/:question' component={Question} />
          <Route path='/course/:name' component={CourseQuestions} />
          <Route path='/' component={Dashboard} />
        </Switch>
      </div>
    )
  }
}
