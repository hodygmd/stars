export interface Star {
    id: number;
    name: string;
    mass: number;
    id_distance_unit: DistanceUnit;
    distance: number;
    id_type: Type;
    status: number;
}

export interface DistanceUnit {
    id: number;
    unit: string;
    status: number;
}

export interface Type {
    id: number;
    type: string;
    description: string;
    status: number;
}