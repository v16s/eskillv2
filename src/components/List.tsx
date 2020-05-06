import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import makeStyles from '@material-ui/core/styles/makeStyles';

import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import Add from '@material-ui/icons/AddBox';

import { VariableMapper } from '../typings/misc';

import { useMutation } from '@apollo/react-hooks';

/**
 * Props:
 * mutation strings for add, edit and delete
 * query string for base data
 * Has a variable mapper that maps variables to required function name for mutation
 * title (string)
 */

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    paddingLeft: '15px',
  },
  textField: {
    width: '100%',
  },
  button: {
    color: '#fff',
    marginLeft: '15px',
    marginBottom: '15px',
  },
}));

const TableList: React.FC<{
  data: any;
  refetch: any;
  title: string;
  addMutation: any;
  editMutation: any;
  deleteMutation: any;
  variableMapper: VariableMapper;
  name: string
}> = ({
  data,
  refetch,
  title,
  addMutation,
  editMutation,
  variableMapper,
  deleteMutation,
  name
}) => {
  // Hooks

  const classes = useStyles();
  const [editing, setEditing] = React.useState(-1);
  const [value, setValue] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const [addCaller, { data: addData, error: addError }] = useMutation(
    addMutation
  );
  const [editCaller, { data: editData, error: editError }] = useMutation(
    editMutation
  );
  const [deleteCaller, { data: deleteData, error: deleteError }] = useMutation(
    deleteMutation
  );
  React.useEffect(() => {
    refetch();
  }, [addData, addError, editData, editError, deleteData, deleteError]);

  // Functions
  function handleChange(e) {
    setValue(e.target.value);
  }
  function cancel() {
    setEditing(-1);
    setValue('');
  }
  function edit(value, index) {
    setValue(value);
    setEditing(index);
  }
  function finish(prevValue) {
    editCaller(variableMapper.edit({id: prevValue, name}, value));
    setEditing(-1);
    setValue('');
  }
  function addInitiate() {
    setAdding(true);
  }
  function add() {
    addCaller(variableMapper.add({name, tname: value, id: value}));
    setValue('');
    setAdding(false);
  }
  function del(value) {
    deleteCaller(variableMapper.delete({name, id: value}));
  }

  return (
    <div style={{ display: 'flex', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', padding: '10px' }}>
        {data && data.length > 0 && (
          <Typography variant='h6' className={classes.title}>
            {title}
          </Typography>
        )}
        <div className={classes.demo}>
          <List>
            {data.map((d, i) => {
              if (editing == i) {
                return (
                  <ListItem key={d}>
                    <IconButton
                      edge='start'
                      aria-label='Edit'
                      color='primary'
                      onClick={(e) => finish(d)}
                    >
                      <Check />
                    </IconButton>
                    <TextField
                      id='edit-value'
                      value={value}
                      className={classes.textField}
                      onChange={handleChange}
                      margin='normal'
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge='end'
                        aria-label='Delete'
                        color='secondary'
                        onClick={(e) => cancel()}
                      >
                        <Clear />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              }
              return (
                <ListItem key={d}>
                  <IconButton
                    edge='start'
                    aria-label='Edit'
                    onClick={(e) => edit(d, i)}
                  >
                    <EditIcon />
                  </IconButton>
                  <ListItemText primary={d} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      aria-label='Delete'
                      color='secondary'
                      onClick={(e) => del(d)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
          {adding ? (
            <div
              style={{
                display: 'flex',
                padding: 15,
              }}
            >
              <TextField
                id='edit-value'
                value={value}
                style={{ flexGrow: 1, margin: 0 }}
                onChange={handleChange}
                margin='normal'
              />
              <Button
                variant='contained'
                color='primary'
                className={classes.button}
                onClick={add}
              >
                <Add />
              </Button>
            </div>
          ) : (
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={addInitiate}
            >
              <Add />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export { TableList as List };
