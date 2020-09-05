
import Geometry from 'ol/geom/Geometry';

interface GeometryEx extends Geometry {
    ends_?: number[];
    flatCoordinates: number[];
}

export interface FeatureObjectProps {
    layer: 'roads' | 'water';
    kind: 'aeroway' | 'ferry' | 'rail' | 'major_road' | 'minor_road' | 'highway' | 'path' | 'construction';
    bus_network?: string;
    geometry: GeometryEx;
    collision_rank?: number;
    network?: string;
    origin?: FeatureObjectProps;
}