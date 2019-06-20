import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AppBar } from '../../components'
import { history } from '../../util'
import Dashboard from './Dashboard'
import CourseQuestions from './CourseQuestions'
import QuestionView from './QuestionView'
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
          <Route path='/qptest' component={QuestionView} />
          <Route path='/course/:name' component={CourseQuestions} />
          <Route path='/' component={Dashboard} />
        </Switch>
      </div>
    )
  }
}
