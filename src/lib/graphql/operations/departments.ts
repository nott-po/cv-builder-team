export const DEPARTMENTS_QUERY = `
    query Departments {
        departments {
            id
            name
        }
    }
`;

export const CREATE_DEPARTMENT_MUTATION = `
    mutation CreateDepartment($department: CreateDepartmentInput!) {
        createDepartment(department: $department) {
            id
            name
        }
    }
`;

export const UPDATE_DEPARTMENT_MUTATION = `
    mutation UpdateDepartment($department: UpdateDepartmentInput!) {
        updateDepartment(department: $department) {
            id
            name
        }
    }
`;

export const DELETE_DEPARTMENT_MUTATION = `
    mutation DeleteDepartment($department: DeleteDepartmentInput!) {
        deleteDepartment(department: $department) {
            affected
        }
    }
`;
