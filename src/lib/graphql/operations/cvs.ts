export const USER_CVS_QUERY = `
    query GetAllCvs {
        cvs {
            id
            name
            education
            description
            user {
                id
                email
            }
            skills {
                mastery
                name
                categoryId
            }
            languages {
                name
                proficiency
            }
        }
    }
`;

export const CREATE_CV_MUTATION = `
    mutation CreateCv($cv: CreateCvInput!) {
        createCv(cv: $cv) {
            id
            created_at
            name
            education
            description
            user {
                id
                email
            }
        }
    }
`;

export const DELETE_CV_MUTATION = `
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;
