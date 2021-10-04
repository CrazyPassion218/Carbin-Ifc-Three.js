import { BufferGeometry } from 'three';
import { IFCModel } from '../IFCModel';

export interface PropertyAPI {
    getItemProperties(modelID: number, elementID: number, recursive: boolean): Promise<any>;

    getAllItemsOfType(modelID: number, type: number, verbose: boolean): Promise<any[]>;

    getPropertySets(modelID: number, elementID: number, recursive: boolean): Promise<any[]>;

    getTypeProperties(modelID: number, elementID: number, recursive: boolean): Promise<any[]>;

    getMaterialsProperties(modelID: number, elementID: number, recursive: boolean): Promise<any[]>;

    getSpatialStructure(modelID: number, includeProperties?: boolean): Promise<any>;

}

export interface PropertyManagerAPI extends PropertyAPI {
    getExpressId(geometry: BufferGeometry, faceIndex: number): Promise<number>
}