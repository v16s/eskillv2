import React, { Component } from 'react'
import { localPoint } from '@vx/event'
import { Pie } from '@vx/shape'
import { Group } from '@vx/group'
import { withTooltip, Tooltip } from '@vx/tooltip'
import { withStyles } from '@material-ui/styles'
import { Paper, IconButton } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
const styles = theme => ({
  paper: {
    display: 'flex',
    width: '95vw',
    justifyContent: 'center',
    margin: 'auto'
  },
  path: {
    '&:hover': {
      cursor: 'pointer',
      fill: '#fff'
    }
  }
})

class QuestionCircle extends Component {
  render () {
    const { theme, classes, location } = this.props
    let width = 600
    const course = location.pathname
      .split('/')
      .reverse()[0]
      .replace(/_/g, ' ')
    let height = 600
    let margin = { top: 10, bottom: 10, right: 10, left: 10 }
    const radius = Math.min(width, height) / 2
    const centerY = height / 2
    const centerX = width / 2

    let data = [
      { name: '123', usage: 1 },
      { name: '3', usage: 1 },
      { name: '5', usage: 1 }
    ]
    return (
      <Paper className={classes.paper}>
        <svg height={height} width={width}>
          <Group top={centerY - margin.top} left={centerX}>
            <Pie
              data={data}
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
                    <g key={`browser-${arc.data.label}-${i}`}>
                      <a
                        onClick={e => {
                          e.preventDefault()
                          console.log('clicked' + arc.data)
                        }}
                      >
                        <path
                          d={pie.path(arc)}
                          //   fill={
                          //     arc.data.state == 0
                          //       ? '#3281ff'
                          //       : arc.data.state == 1
                          //         ? '#ff3262'
                          //         : arc.data.state == 2
                          //           ? '#00ef5f'
                          //           : '#ffe500'
                          //   }
                          className={classes.path}
                          fill='#3281ff'
                          stroke={theme.palette.background.paper}
                          strokeLinecap='square'
                          strokeLinejoin='bevel'
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
  }
}

export default withRouter(
  withStyles(styles, { withTheme: true })(QuestionCircle)
)
