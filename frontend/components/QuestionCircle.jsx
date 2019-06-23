import React, { Component } from 'react'
import { Pie } from '@vx/shape'
import { Group } from '@vx/group'
import { Query } from 'react-apollo'
import { withStyles } from '@material-ui/styles'
import {
  Paper,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { Loading } from './index'
import { red, green, yellow } from '@material-ui/core/colors'
import gql from 'graphql-tag'
const styles = theme => ({
  paper: {
    display: 'flex',
    width: '95vw',
    justifyContent: 'center',
    margin: 'auto',
    minHeight: '500px'
  },
  path: {
    '&:hover': {
      cursor: 'pointer',
      fill: theme.palette.text.primary
    }
  },
  clickable: {
    '&:hover': {
      cursor: 'pointer'
    },
    padding: 15
  }
})
const INSTANCE = gql`
  query Instance($id: String!) {
    instance(id: $id) {
      course
      questions {
        id
        status
        ans
      }
    }
  }
`
class QuestionCircle extends Component {
  constructor (props) {
    super(props)
    this.state = { width: 0, height: 0 }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }
  render () {
    const { theme, classes, match } = this.props
    let { width: windowWidth } = this.state
    let width = 600
    const id = match.params.name
    let height = 600
    let margin = { top: 10, bottom: 10, right: 10, left: 10 }
    const radius = Math.min(width, height) / 2
    const centerY = height / 2
    const centerX = width / 2
    return (
      <Query query={INSTANCE} variables={{ id }}>
        {({ data, loading }) => {
          if (loading) {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Loading />
              </div>
            )
          }
          const { course, questions } = data.instance
          if (windowWidth < 768) {
            return (
              <Paper>
                <List
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    padding: 0
                  }}
                >
                  {questions.map((q, i) => {
                    let color =
                      q.status == 1
                        ? red[400]
                        : q.status == 2
                          ? green[400]
                          : q.answer && q.answer != ''
                            ? '#3281ff'
                            : yellow[400]
                    return (
                      <div>
                        {' '}
                        <ListItem
                          key={q.id}
                          style={{ color }}
                          className={classes.clickable}
                          onClick={e =>
                            this.props.history.push(`${match.url}/${q.id}`)
                          }
                        >
                          <ListItemText>Question {i + 1}</ListItemText>
                        </ListItem>
                        {i < questions.length - 1 && <Divider />}
                      </div>
                    )
                  })}
                </List>
              </Paper>
            )
          }
          const piedata = questions.map(d => ({ ...d, usage: 1 }))
          return (
            <Paper className={classes.paper}>
              <svg height={height} width={width}>
                <Group top={centerY - margin.top} left={centerX}>
                  <Pie
                    data={piedata}
                    pieValue={d => d.usage}
                    outerRadius={radius - radius / 3}
                    innerRadius={radius - radius / 6}
                    cornerRadius={0}
                    padAngle={0}
                  >
                    {pie => {
                      return pie.arcs.map((arc, i) => {
                        const opacity = 1
                        const [centroidX, centroidY] = pie.path.centroid(arc)
                        const { startAngle, endAngle } = arc
                        {
                          /* const hasSpaceForLabel = endAngle - startAngle >= 0.1 */
                        }
                        return (
                          <g key={`browser-${arc.data.id}-${i}`}>
                            <a
                              onClick={e => {
                                e.preventDefault()
                                this.props.history.push(
                                  `${match.url}/${arc.data.id}`
                                )
                              }}
                            >
                              <path
                                d={pie.path(arc)}
                                fill={
                                  arc.data.status == 1
                                    ? red[400]
                                    : arc.data.status == 2
                                      ? green[400]
                                      : arc.data.answer && arc.data.answer != ''
                                        ? '#3281ff'
                                        : yellow[400]
                                }
                                className={classes.path}
                                stroke={theme.palette.background.paper}
                                strokeLinecap='round'
                                strokeLinejoin='miter'
                                strokeWidth={4}
                                fillOpacity={opacity}
                                //   onMouseMove={event =>
                                //     this.handleTooltip({
                                //       event,
                                //       da: {
                                //         content: arc.data.name,
                                //         bgc:
                                //           arc.data.state == 0
                                //             ? "red"
                                //             : arc.data.state == 1
                                //             ? "yellow"
                                //             : "green",
                                //         color:
                                //           arc.data.state == 0 ? "white" : "black"
                                //       }
                                //     })
                                //   }
                                //   onMouseLeave={event => hideTooltip()}
                              />
                            </a>
                          </g>
                        )
                      })
                    }}
                  </Pie>
                </Group>
                <Group
                  top={centerY - margin.top}
                  left={centerX}
                  width={400}
                  height={40}
                >
                  <text
                    style={{
                      fill: theme.palette.text.primary,
                      ...theme.typography.h4
                    }}
                    textAnchor='middle'
                    className='center-label'
                  >
                    {course}
                  </text>
                </Group>
              </svg>
            </Paper>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(
  withStyles(styles, { withTheme: true })(QuestionCircle)
)
