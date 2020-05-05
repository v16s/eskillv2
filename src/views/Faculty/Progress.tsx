import React from 'react';
import gql from 'graphql-tag';
import { graphql, withApollo } from '@apollo/react-hoc';
import { compose } from 'recompose';
import { withStyles, createStyles } from '@material-ui/styles';
import {
  Grid,
  LinearProgress,
  IconButton,
  Button,
  Paper,
} from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { StudentProgressTable } from '../../components';
import { Dropdown, Document } from '../../components';
import { PDFDownloadLink } from '@react-pdf/renderer';
const styles = createStyles((theme) => ({
  root: {
    display: 'flex',
    color: theme.palette.text.primary,
    padding: '30px',
  },
  outer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '60%',
  },
  paper: {
    padding: 10,
    marginBottom: 20,
    boxShadow: 'none',
  },
}));
const REQUESTS = gql`
  query Progress {
    progress {
      id
      studentReg
      studentName
      completed
      total
      correct
      course
    }
  }
`;
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
const REJECT = gql`
  mutation($id: String!) {
    rejectCourseInstance(id: $id) {
      id
    }
  }
`;
class Dashboard extends React.Component<any, any> {
  state = {
    show: false,
    courses: [],
    where: {
      course: {
        label: 'All',
        value: 'All',
      },
      faculty: {
        label: 'All',
        value: 'All',
      },
    },
  };
  close = () => {
    this.setState({ show: !this.state.show });
  };
  delete = (id) => {
    this.props.reject({ variables: { id } });
    this.props.data.refetch();
  };
  onDropdownChange = (value, { name }) => {
    let newstate = this.state;
    newstate.where[name] = value;
    let where = {};
    if (!(newstate.where.course.value == 'All')) {
      where['course'] = newstate.where.course.value;
    }
    this.setState(newstate);
  };
  onBranchChange = (value, e) => {
    let newstate = this.state;
    newstate[e.name] = value;
    newstate.where[e.name] = value;
    let { client } = this.props;
    client
      .query({
        query: COURSES,
        variables: {
          branch: value.value,
        },
      })
      .then(({ data }) => {
        this.setState({ courses: data.courses });
      });
    this.setState(newstate);
  };
  render() {
    const { classes, data } = this.props;
    let branches: any = [];
    if (this.props.branchQuery.branches) {
      branches = [
        ...this.props.branchQuery.branches.map((d: any) => ({
          label: d.name,
          value: d.name,
        })),
      ];
    }
    const courses = [
      ...Array.from(new Set(this.state.courses.map((d: any) => d.name))).map(
        (d) => ({
          label: d,
          value: d,
        })
      ),
      { label: 'All', value: 'All' },
    ];
    data.progress = data.progress
      ? data.progress.filter((d) =>
          d.course
            .toLowerCase()
            .includes(
              this.state.where.course.label != 'All'
                ? this.state.where.course.label.toLowerCase()
                : ''
            )
        )
      : [];
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={3}
          style={{ height: 'auto', flexDirection: 'column' }}
        >
          <div className={classes.outer}>
            <Paper className={classes.paper}>
              <Dropdown
                options={branches}
                onChange={this.onBranchChange}
                label='Branch'
                name='branch'
              />
            </Paper>
            <Paper className={classes.paper}>
              <Dropdown
                options={courses}
                onChange={this.onDropdownChange}
                label='Course'
                name='course'
                value={this.state.where.course}
              />
            </Paper>
          </div>
          <PDFDownloadLink
            style={{ marginBottom: 10 }}
            document={
              <Document
                data={
                  data.progress
                    ? data.progress.map((d) => ({
                        regNumber: d.studentReg,
                        name: d.studentName,
                        percentage: (
                          (Number(d.correct) * 100.0) /
                          Number(d.total)
                        ).toFixed(),
                      }))
                    : []
                }
                // course={where.course.value}
              />
            }
            fileName='report.pdf'
          >
            {({ blob, url, loading, error }: any) =>
              loading ? (
                'Loading document...'
              ) : (
                <Button
                  color='primary'
                  variant='contained'
                  onClick={(e) => {
                    window.location.href = url;
                  }}
                  style={{
                    width: '100%',
                    flexGrow: 1,
                  }}
                >
                  Print
                </Button>
              )
            }
          </PDFDownloadLink>
          <StudentProgressTable
            columns={[
              { title: 'Register Number', field: 'studentReg' },
              { title: 'Name', field: 'studentName' },
              {
                title: 'Progress',
                render: (args) => {
                  const { completed, total } = args;
                  return (
                    <LinearProgress
                      variant='determinate'
                      value={(Number(completed) * 100.0) / Number(total)}
                    />
                  );
                },
              },
              {
                title: '%',
                render: ({ correct, total }) =>
                  `${((Number(correct) * 100.0) / Number(total)).toFixed(0)}`,
              },
              {
                title: '',
                render: (rowData) => (
                  <IconButton
                    color='secondary'
                    onClick={(e) => this.delete(rowData.id)}
                  >
                    <DeleteForever />
                  </IconButton>
                ),
              },
            ]}
            data={data.progress || []}
          />
        </Grid>
      </div>
    );
  }
}

export default compose(
  withApollo,
  graphql(REQUESTS),
  graphql(REJECT, { name: 'reject' }),
  graphql(BRANCHES, {
    name: 'branchQuery',
    options: { fetchPolicy: 'network-only' },
  })
)(withStyles(styles)(Dashboard));
