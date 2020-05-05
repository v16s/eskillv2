import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Dropdown, Table, NewQuestion, EditQuestion } from '../../components';
import { Add, DeleteOutline as Delete } from '@material-ui/icons';

const BRANCHES = gql`
  query Branches {
    branches {
      name
    }
  }
`;

const COURSES = gql`
  query Courses($name: String, $branch: String) {
    courses(where: { name: $name, branch: $branch }) {
      name
    }
  }
`;
const QUESTIONS = gql`
  query Questions($course: String!) {
    questions(where: { course: $course }) {
      id
      name
      desc
      course
      exp
      opt {
        a
        b
        c
        d
      }
      ans
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    padding: '0 20px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    marginTop: 15,
    width: '100%',
  },
  heading: {
    fontFamily: 'monospace',
    textAlign: 'center',
    fontWeight: 500,
  },
  button: {
    width: '100%',
    marginTop: '10px',
  },
  padded: {
    padding: '20px',
  },
  icon: {
    color: '#fff',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    maxWidth: '200px',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'auto',
    padding: '20px 0',
  },
}));

const Questions: React.FC = () => {
  const { data: branchQueryData } = useQuery(BRANCHES);
  const classes = useStyles();

  // React Hook Calls
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
  const [selectedBranch, setSelectedBranch] = React.useState<any>(null);
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [newModal, setNewModal] = React.useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = React.useState<any>(null);
  const [courseQuery, { data: courseQueryData }] = useLazyQuery(COURSES);
  const [
    questionQuery,
    { data: questionQueryData, called: questionQueryCalled },
  ] = useLazyQuery(QUESTIONS);

  // Data Manipulations
  const branches =
    (branchQueryData &&
      branchQueryData.branches.map((d) => ({
        label: d.name,
        value: d.name,
      }))) ||
    [];
  const courseDataArray: Array<any> =
    (courseQueryData &&
      courseQueryData.courses.map((d) => ({
        label: d.name,
        value: d.name,
      }))) ||
    [];
  const courses = [
    ...new Set(courseDataArray.map((d) => d.label)),
  ].map((d) => ({ label: d, value: d }));

  // Functions
  function onCourseChange(value) {
    const { value: course } = value;
    questionQuery({ variables: { course } });
    setSelectedCourse(value);
  }
  function onBranchChange(value) {
    const { value: branch } = value;
    courseQuery({ variables: { branch } });
    setSelectedBranch(value);
  }
  function editQuestion(e, rowData) {
    setCurrentQuestion(rowData);
    setEditModal(true);
  }
  function showNewModal() {
    setNewModal(true);
  }
  function closeNewModal(refetch) {
    setNewModal(false);
    if (refetch) {
      questionQuery({ variables: { course: selectedCourse.value } });
    }
  }
  function closeEditModal(refetch) {
    setEditModal(false);
    if (refetch) {
      questionQuery({ variables: { course: selectedCourse.value } });
    }
  }

  // Base Data Variables
  const columns = [
    { title: 'ID', field: 'id' },
    { title: 'Title', field: 'name' },
    {
      title: 'Remove',
      render: ({ id }) => (
        <IconButton
          style={{
            color: '#fff',
          }}
          onClick={(e) => {
            e.preventDefault();
            this.removeQuestion(id);
          }}
          color='secondary'
          aria-label='Delete'
        >
          <Delete />
        </IconButton>
      ),
      disableClick: true,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
        }}
        className={classes.padded}
      >
        <Paper className={classes.paper}>
          <Dropdown
            className={classes.input}
            options={branches}
            onChange={onBranchChange}
            label='Branch'
            name='branch'
            value={selectedBranch}
          />
          <Dropdown
            className={classes.input}
            options={courses}
            onChange={onCourseChange}
            label='Course'
            name='course'
            value={selectedCourse}
          />
          <div className={classes.padded}>
            {/* {questionQueryCalled && questionQueryData?.questions.length > 0 && (
              <Table
                data={questionQueryData?.questions}
                columns={columns}
                title={selectedCourse.value}
                style={{ boxShadow: 'none' }}
                uneditable
                onRowClick={editQuestion}
              />
            )} */}
          </div>
          {!newModal && (
            <Fab
              className={classes.icon}
              onClick={showNewModal}
              variant='extended'
              color='primary'
              aria-label='Add'
            >
              <Add />
              New Question
            </Fab>
          )}
          <Modal
            className={classes.root}
            open={newModal}
            onClose={closeNewModal}
          >
            <NewQuestion close={closeNewModal} branches={branches} />
          </Modal>
          {editModal && (
            <Modal
              className={classes.root}
              open={editModal}
              onClose={closeEditModal}
            >
              <EditQuestion
                close={closeEditModal}
                branches={branches}
                question={currentQuestion}
              />
            </Modal>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Questions;
