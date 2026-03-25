export type PositionRow = {
    id: string;
    name: string;
};

export type PositionsQueryResult = {
    positions: PositionRow[];
};

export const positionsListKey = () => ["positions", "list"] as const;

export const POSITIONS_QUERY = `
    query Positions {
        positions {
            id
            created_at
            name
        }
    }
`;

export const CREATE_POSITION_MUTATION = `
    mutation CreatePosition($position: CreatePositionInput!) {
        createPosition(position: $position) {
            id
            name
        }
    }
`;

export const UPDATE_POSITION_MUTATION = `
    mutation UpdatePosition($position: UpdatePositionInput!) {
        updatePosition(position: $position) {
            id
            name
        }
    }
`;

export const DELETE_POSITION_MUTATION = `
    mutation DeletePosition($position: DeletePositionInput!) {
        deletePosition(position: $position) {
            affected
        }
    }
`;
