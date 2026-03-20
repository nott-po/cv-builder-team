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

export const CV_QUERY = `
  query GetCv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      created_at
      name
      education
      description
      user {
        id
        email
      }
      projects {
        id
        name
      }
      skills {
        name
        mastery
      }
      languages {
        name
        proficiency
      }
    }
  }
`;

export const UPDATE_CV_MUTATION = `
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`;

export const ADD_CV_SKILL_MUTATION = `
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
    }
  }
`;

export const UPDATE_CV_SKILL_MUTATION = `
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      id
    }
  }
`;

export const DELETE_CV_SKILL_MUTATION = `
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
    }
  }
`;
