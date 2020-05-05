import React from 'react';
import gql from 'graphql-tag';
import { graphql, withApollo } from '@apollo/react-hoc';
import { compose } from 'recompose';
import { Query } from '@apollo/react-components';
import { withStyles, createStyles } from '@material-ui/styles';
import { Grid, LinearProgress, Paper, Button } from '@material-ui/core';
import {
  StudentProgressTable,
  Dropdown,
  Document,
  DocumentAll,
} from '../../components';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { withRouter } from 'react-router-dom';
import { groupBy } from 'lodash';

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
  },
}));
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
const PROGRESS = gql`
  query Progress($where: CourseInstanceWhereInput!) {
    progress(where: $where) {
      id
      studentReg
      studentName
      completed
      correct
      total
      course
    }
  }
`;

const FACULTIES = gql`
  query Faculties($where: FacultyWhereInput) {
    faculties(where: $where) {
      name
      id
      username
    }
  }
`;
class Progress extends React.Component<any, any> {
  state = {
    show: false,
    courses: [],
    faculties: [],
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
  onDropdownChange = (value, { name }) => {
    let newstate = this.state;
    let { client } = this.props;
    newstate.where[name] = value;
    let where = {};
    if (!(newstate.where.course.value == 'All')) {
      where['course'] = newstate.where.course.value;
    }

    client
      .query({ query: FACULTIES, variables: { where } })
      .then(({ data }) => {
        newstate.faculties = data.faculties;
        this.setState(newstate);
      });
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
    const { classes } = this.props;

    let branches: any = [];
    if (this.props.branchQuery.branches) {
      branches = [
        ...this.props.branchQuery.branches.map((d) => ({
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
    const faculties: any = [
      ...this.state.faculties.map((d: any) => ({
        label: `${d.username} - ${d.name}`,
        value: d.id,
      })),
      { label: 'All', value: 'All' },
    ];
    let { where } = this.state;
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={3}
          style={{ height: 'auto', justifyContent: 'center' }}
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
            <Paper className={classes.paper}>
              <Dropdown
                options={faculties}
                onChange={this.onDropdownChange}
                label='Faculty'
                name='faculty'
                value={this.state.where.faculty}
              />
            </Paper>
            <Query
              query={PROGRESS}
              variables={{
                where: {
                  course:
                    where.course.value != 'All'
                      ? where.course.value
                      : undefined,
                  facultyID:
                    where.faculty.value != 'All'
                      ? where.faculty.value
                      : undefined,
                },
              }}
              fetchPolicy='network-only'
            >
              {({ data, loading, error }: any) => {
                console.log(data, error);
                if (loading) {
                  return null;
                } else {
                  return (
                    <>
                      {where.course.value != 'All' ? (
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
                                      ).toFixed(0),
                                    }))
                                  : []
                              }
                              course={where.course.value}
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
                      ) : (
                        <PDFDownloadLink
                          style={{ marginBottom: 10 }}
                          document={
                            <DocumentAll
                              data={
                                data.progress
                                  ? groupBy(
                                      data.progress.map((d) => ({
                                        regNumber: d.studentReg,
                                        name: d.studentName,
                                        percentage: (
                                          (Number(d.correct) * 100.0) /
                                          Number(d.total)
                                        ).toFixed(0),
                                        course: d.course,
                                      })),
                                      (d) => d.course
                                    )
                                  : []
                              }
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
                                Print All
                              </Button>
                            )
                          }
                        </PDFDownloadLink>
                      )}

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
                                  value={
                                    (Number(completed) * 100.0) / Number(total)
                                  }
                                />
                              );
                            },
                          },
                          {
                            title: 'Course',
                            field: 'course',
                          },
                          {
                            title: '%',
                            render: ({ correct, total }) =>
                              `${(
                                (Number(correct) * 100.0) /
                                Number(total)
                              ).toFixed(0)}`,
                          },
                        ]}
                        data={(data && data.progress) || []}
                      />
                    </>
                  );
                }
              }}
            </Query>
          </div>
        </Grid>
      </div>
    );
  }
}

export default withRouter(
  compose(
    withApollo,
    graphql(BRANCHES, {
      name: 'branchQuery',
      options: { fetchPolicy: 'network-only' },
    })
  )(withStyles(styles)(Progress))
);
