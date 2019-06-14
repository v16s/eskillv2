import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  Button
} from '@material-ui/core/'
import {
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Check,
  Clear,
  AddBox as Add
} from '@material-ui/icons'

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    paddingLeft: '15px'
  },
  textField: {
    width: '100%'
  },
  button: {
    color: '#fff',
    marginLeft: '15px',
    marginBottom: '15px'
  }
})

class TableList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.data || [],
      editing: 0,
      edit: false,
      value: '',
      addValue: '',
      add: false
    }
  }
  edit = (d, i) => {
    this.setState({ edit: true, editing: i, value: d })
  }
  componentWillUpdate (nextProps, nextState) {
    nextState.data = nextProps.data
    return true
  }
  handleChange = e => {
    this.setState({ value: e.target.value })
  }
  handleAddChange = e => {
    this.setState({ addValue: e.target.value })
  }
  finish = oldValue => {
    this.props.handleUpdate(oldValue, this.state.value).then(() => {
      this.setState({ edit: false })
    })
  }
  cancel = () => {
    this.setState({ edit: false })
  }
  delete = value => {
    this.props.handleDelete(value)
  }
  addInitiate = () => {
    this.setState({ add: true, addValue: '' })
  }
  add = () => {
    this.props.handleAdd(this.props.current, this.state.addValue).then(() => {
      this.setState({ add: false })
    })
  }
  render () {
    const { data, editing, edit, value } = this.state
    const { title, classes } = this.props
    return (
      <div style={{ width: '100%', padding: '10px' }}>
        {data && data.length > 0 && (
          <Typography variant='h6' className={classes.title}>
            {title}
          </Typography>
        )}
        <div className={classes.demo}>
          <List>
            {data.map((d, i) => {
              if (edit && editing == i) {
                return (
                  <ListItem key={d}>
                    <IconButton
                      edge='start'
                      aria-label='Edit'
                      color='primary'
                      onClick={e => this.finish(d)}
                    >
                      <Check />
                    </IconButton>
                    <TextField
                      id='edit-value'
                      value={value}
                      className={classes.textField}
                      onChange={this.handleChange}
                      margin='normal'
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge='end'
                        aria-label='Delete'
                        color='secondary'
                        onClick={e => this.cancel()}
                      >
                        <Clear />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              }
              return (
                <ListItem  key={d}>
                  <IconButton
                    edge='start'
                    aria-label='Edit'
                    onClick={e => this.edit(d, i)}
                  >
                    <EditIcon />
                  </IconButton>
                  <ListItemText primary={d} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      aria-label='Delete'
                      color='secondary'
                      onClick={e => this.delete(d)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
          {this.state.add ? (
            <div
              style={{
                display: 'flex',
                padding: 15
              }}
            >
              <TextField
                id='edit-value'
                value={this.state.addValue}
                style={{ flexGrow: 1, margin: 0 }}
                onChange={this.handleAddChange}
                margin='normal'
              />
              <Button
                variant='contained'
                color='primary'
                className={classes.button}
                onClick={this.add}
              >
                <Add />
              </Button>
            </div>
          ) : (
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={this.addInitiate}
            >
              <Add />
              Add
            </Button>
          )}
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(TableList)
