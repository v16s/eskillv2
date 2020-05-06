import React from 'react';
import {
  CourseTable,
  RegisterControl,
  Dropdown,
  CampusTable,
} from '../../components';
import gql from 'graphql-tag';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { useHistory } from 'react-router-dom';
import * as mutations from './mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';

const COURSES = gql`
  {
    courses {
      branch
      name
      coordinator_id
      automated
      campus
    }
  }
`;
const CAMPUSES = gql`
  {
    campuses {
      departments {
        name
        id
      }
      admin_id
      name
    }
  }
`;

const VERIFY = gql`
  mutation {
    reverify
  }
`;

const DANGEROUS__REMOVE_ALL_INSTANCES = gql`
  mutation {
    adminDeleteAllCourseInstances__DANGEROUS
  }
`;

const Dashboard: React.FC = () => {
  const {
    data: courses,
    loading: coursesLoading,
    refetch: coursesRefetch,
  } = useQuery(COURSES);
  const {
    data: campuses,
    loading: campusesLoading,
    refetch: campusesRefetch,
  } = useQuery(CAMPUSES);
  const [verify] = useMutation(VERIFY);
  const [DANGEROUS__delete] = useMutation(DANGEROUS__REMOVE_ALL_INSTANCES);
  const { push } = useHistory();
  const [campus, selectCampus] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(false);
  console.log(courses);
  const campusDropdownData = campuses
    ? campuses.campuses.map((d) => ({ label: d.name, id: d.id }))
    : [];

  function handleModalOpen() {
    setDeleteModal(true);
  }
  function handleModalClose() {
    setDeleteModal(false);
  }
  function onDropdownChange(value) {
    selectCampus(value);
  }

  return (
    <div>
      <RegisterControl />
      <div
        style={{
          display: 'flex',
        }}
      >
        <div style={{ width: '50%', padding: '20px' }}>
          <CampusTable
            ADD={mutations.ADD_CAMPUS}
            UPDATE={mutations.UPDATE_CAMPUS}
            REMOVE={mutations.REMOVE_CAMPUS}
            ADD_INNER={mutations.ADD_DEPARTMENT}
            UPDATE_INNER={mutations.UPDATE_DEPARTMENT}
            REMOVE_INNER={mutations.REMOVE_DEPARTMENT}
            variableMapper={mutations.variableMapperCampus}
            variableMapperInner={mutations.variableMapperDepartment}
            data={campuses?.campuses}
            refetch={campusesRefetch}
            loading={campusesLoading}
          />
        </div>
        <div style={{ width: '50%', padding: '20px' }}>
          <Button
            style={{ margin: '0 auto', marginBottom: 15, width: '50%' }}
            color='primary'
            onClick={(e) => {
              verify();
            }}
          >
            Verify Correct Answers (Temporary)
          </Button>
          <Button
            style={{ margin: '0 auto', marginBottom: 15, width: '50%' }}
            color='primary'
            onClick={(e) => {
              push('/defaults');
            }}
          >
            Set Default Courses
          </Button>
          <Paper
            style={{
              marginBottom: 15,
              padding: 15,
              zIndex: 5,
            }}
          >
            <div>
              <Dropdown
                options={campusDropdownData}
                onChange={onDropdownChange}
                value={campus}
                placeholder={'Select your campus'}
                label='College Campus'
                name='campus'
              />
            </div>
          </Paper>

          <CourseTable
            data={courses?.courses}
            refetch={coursesRefetch}
            loading={coursesLoading}
            ADD={mutations.ADD_COURSE}
            REMOVE={mutations.REMOVE_COURSE}
            UPDATE={mutations.UPDATE_COURSE}
            TOGGLE={mutations.TOGGLE}
            variableMapper={mutations.variableMapperCourse}
          />
          <Button
            style={{ margin: '0 auto', marginTop: 15, width: '100%' }}
            color='secondary'
            variant='contained'
            onClick={handleModalOpen}
          >
            Delete All Course Instances
          </Button>
          <Modal
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
            open={deleteModal}
            onClose={handleModalClose}
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Paper
              style={{
                width: 400,
                padding: 20,
              }}
            >
              <h2 id='simple-modal-title' style={{ color: '#ff0000' }}>
                DANGER
              </h2>
              <p id='simple-modal-description'>Please Confirm your action</p>
              <Button
                style={{
                  margin: '0 auto',
                  backgroundColor: '#ff0000',
                  color: '#fff',
                }}
                variant='contained'
                onClick={(e) => {
                  DANGEROUS__delete();
                  handleModalClose();
                }}
              >
                Confirm
              </Button>
            </Paper>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
