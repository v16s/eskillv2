import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelActions,
  Button,
  Divider,
  Chip,
  makeStyles,
  Modal,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { EditQuestion } from './EditQuestion';

import gql from 'graphql-tag';

const QUESTION = gql`
  query Question($id: String!) {
    question(id: $id) {
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

const STUDENT = gql`
  query Student($id: String!) {
    student(id: $id) {
      name
      department
    }
  }
`;

export const REJECT = gql`
  mutation FacultyReject($id: String!) {
    facultyRejectProblem(id: $id) {
      status
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    padding: '30px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
  },
  approved: {
    backgroundColor: '#00ffa5',
    color: theme.palette.grey[700],
  },
  pending: {
    color: theme.palette.grey[700],
    backgroundColor: '#eeff00',
  },
  expansionPanel: {
    backgroundColor:
      theme.palette.type == 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[200],
  },
  chip: {
    marginRight: 15,
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'auto',
    padding: '20px 0',
  },
}));

export const ProblemDisplay = ({
  description,
  status: _status,
  idx,
  studID,
  id,
  refetch,
  queID,
}) => {
  const classes = useStyles();
  const [modal, setModal] = React.useState(false);
  const [loadQuestion, { data: questionData }] = useLazyQuery(QUESTION);
  console.log(questionData);
  const [loadStudent, { called, data }] = useLazyQuery(STUDENT, {
    variables: { id: studID },
  });
  const [reject] = useMutation(REJECT);
  const [expanded, setExpanded] = React.useState(null);
  const handleChange = (idx) => {
    if (expanded == idx) {
      setExpanded(null);
    } else {
      setExpanded(idx);
      if (!called) {
        loadStudent();
      }
    }
  };
  const status = parseInt(_status);
  function handleModalOpen(id) {
    loadQuestion({ variables: { id } });
    setModal(true);
  }
  function handleModalClose() {
    setModal(false);
  }
  const statusValue: {
    label: string;
    className: string;
    color?: 'secondary';
  } = {
    label:
      status > 0 ? 'Approved' : status < 0 ? 'Rejected' : 'Pending Approval',
    className:
      status > 0 ? classes.approved : status == 0 ? classes.pending : '',
    color: status < 0 ? 'secondary' : undefined,
  };

  return (
    <ExpansionPanel
      className={classes.expansionPanel}
      expanded={expanded === idx}
      onChange={(e) => handleChange(idx)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1bh-content'
        id='panel1bh-header'
      >
        <Chip
          label={statusValue.label}
          color={statusValue.color}
          className={`${classes.chip} ${statusValue.className}`}
        />

        <Typography className={classes.secondaryHeading}>
          {description.length < 100
            ? description
            : expanded === idx
            ? ''
            : `${description.slice(0, 100)}...`}
        </Typography>
      </ExpansionPanelSummary>
      {description.length > 20 && (
        <ExpansionPanelDetails>
          <Typography>{description}</Typography>
        </ExpansionPanelDetails>
      )}

      <Divider />
      {data && (
        <>
          <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
            <Typography>{data.student.name}</Typography>
            <Typography>{data.student.department}</Typography>
          </ExpansionPanelDetails>
          <Divider />
        </>
      )}
      <ExpansionPanelActions>
        <Button
          size='small'
          color='secondary'
          variant='contained'
          onClick={(e) => {
            reject({ variables: { id } }).then(() => {
              refetch();
            });
          }}
        >
          Reject
        </Button>
        <Button
          size='small'
          onClick={(e) => handleModalOpen(queID)}
          className={classes.approved}
          variant='contained'
        >
          Resolve
        </Button>
      </ExpansionPanelActions>
      <Modal className={classes.modal} open={modal} onClose={handleModalClose}>
        <div>
          {' '}
          {questionData && questionData.question && (
            <EditQuestion
              close={handleModalClose}
              coordinator
              course={questionData.question.course}
              question={questionData.question}
            />
          )}
        </div>
      </Modal>
    </ExpansionPanel>
  );
};
