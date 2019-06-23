import React, { Component } from 'react'
import { Modal } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { red, green } from '@material-ui/core/colors'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { ReportProblem, Loading, QuestionView } from '../../components'
import { withRouter } from 'react-router-dom'

const styles = ({ palette }) => ({
  griditem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  paper: {
    margin: '20px 0'
  },
  danger: {
    color: '#fff',
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[600]
    }
  },
  answer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '5px 0'
  },
  radioWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  radiopaper: {
    flexGrow: '1',
    marginLeft: '15px',
    padding: '10px'
  },
  grey: {
    backgroundColor:
      palette.type == 'dark' ? palette.grey[700] : palette.grey[200]
  },
  green: {
    backgroundColor: green[400],
    '&$checked': {
      '&$disabled': {
        color: green[400]
      },
      color: green[400]
    }
  },
  primary: {
    backgroundColor: palette.primary.main
  },
  red: {
    backgroundColor: red[400],
    '&$checked': {
      '&$disabled': {
        color: red[400]
      },
      color: red[400]
    }
  }
})

const QUESTION = gql`
  query Question($id: String!, $cid: String!) {
    question(id: $id) {
      name
      desc
      exp
      opt {
        a
        b
        c
        d
      }
      display
      exp
    }
    instance(id: $cid) {
      questions {
        id
        ans
        status
      }
    }
  }
`

class Question extends Component {
  state = { open: false }
  close = () => {
    this.setState({ open: !this.state.open })
  }

  render () {
    let { classes, match } = this.props
    return (
      <div>
        <Query
          query={QUESTION}
          fetchPolicy='network-only'
          variables={{ id: match.params.question, cid: match.params.name }}
        >
          {({ loading, data, refetch }) => {
            if (loading) {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '600px'
                  }}
                >
                  <Loading />
                </div>
              )
            }
            const position = data.instance.questions.findIndex(
              d => d.id == match.params.question
            )
            const current = data.instance.questions[position]
            console.log(current)
            const last = data.instance.questions.length - 1
            return (
              <QuestionView
                question={match.params.question}
                course={match.params.name}
                questions={data.instance.questions}
                {...data.question}
                refetch={refetch}
                position={position}
                last={last}
                close={this.close}
                classes={classes}
                ans={data.instance.questions[position].ans}
                status={data.instance.questions[position].status}
              />
            )
          }}
        </Query>

        <Modal
          aria-labelledby='report-problem'
          aria-describedby='report-problem-here'
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100vw',
            alignItems: 'center',
            padding: 20,
            boxSizing: 'border-box'
          }}
          open={this.state.open}
          onClose={this.close}
        >
          <ReportProblem close={this.close} />
        </Modal>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Question))
