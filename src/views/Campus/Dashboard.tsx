import React from 'react';
import { CourseTable, RegisterControl, CampusTable } from '../../components';
import gql from 'graphql-tag';
import * as mutations from './mutations';
import { useQuery } from '@apollo/react-hooks';

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
            uneditable
            ADD={null}
            UPDATE={null}
            REMOVE={null}
            ADD_INNER={mutations.ADD_DEPARTMENT}
            UPDATE_INNER={mutations.UPDATE_DEPARTMENT}
            REMOVE_INNER={mutations.REMOVE_DEPARTMENT}
            variableMapper={mutations.variableMapperCampus}
            variableMapperInner={mutations.variableMapperCampus}
            data={campuses?.campuses}
            refetch={campusesRefetch}
            loading={campusesLoading}
          />
        </div>
        <div style={{ width: '50%', padding: '20px' }}>
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
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
