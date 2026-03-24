export const LANGUAGES_QUERY = `
    query Languages {
        languages {
            id
            iso2
            name
            native_name
        }
    }
`;

export const CREATE_LANGUAGE_MUTATION = `
    mutation CreateLanguage($language: CreateLanguageInput!) {
        createLanguage(language: $language) {
            id
            iso2
            name
            native_name
        }
    }
`;

export const UPDATE_LANGUAGE_MUTATION = `
    mutation UpdateLanguage($language: UpdateLanguageInput!) {
        updateLanguage(language: $language) {
            id
            iso2
            name
            native_name
        }
    }
`;

export const DELETE_LANGUAGE_MUTATION = `
    mutation DeleteLanguage($language: DeleteLanguageInput!) {
        deleteLanguage(language: $language) {
            affected
        }
    }
`;
