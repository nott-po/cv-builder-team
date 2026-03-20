export const PROJECTS_QUERY = `
    query Projects {
        projects {
            id
            name
            domain
            start_date
            end_date
            description
            environment
        }
    }
`;

export const CREATE_PROJECT_MUTATION = `
    mutation CreateProject($project: CreateProjectInput!) {
        createProject(project: $project) {
            id
            name
            domain
            start_date
            end_date
            description
            environment
        }
    }
`;

export const UPDATE_PROJECT_MUTATION = `
    mutation UpdateProject($project: UpdateProjectInput!) {
        updateProject(project: $project) {
            id
            name
            domain
            start_date
            end_date
            description
            environment
        }
    }
`;

export const DELETE_PROJECT_MUTATION = `
    mutation DeleteProject($project: DeleteProjectInput!) {
        deleteProject(project: $project) {
            affected
        }
    }
`;
