import * as WebIFC from 'web-ifc';
import { IFCParser } from './IFCParser';
import { DisplayManager } from './DisplayManager';
import { ItemPicker } from './ItemPicker';
import { PropertyManager } from './PropertyManager';
import { Display, IfcMesh, IfcState, MapFaceIndexID, MapIDFaceIndex } from './BaseDefinitions';
import { BufferGeometry, Intersection, Mesh, Scene } from 'three';

export class IFCManager {
    private state: IfcState;
    private parser: IFCParser;
    private display: DisplayManager;
    private properties: PropertyManager;
    private picker: ItemPicker;

    constructor() {
        this.state = { models: [], api: new WebIFC.IfcAPI() };
        this.parser = new IFCParser(this.state);
        this.display = new DisplayManager(this.state);
        this.properties = new PropertyManager(this.state);
        this.picker = new ItemPicker(this.display);
    }

    parse(buffer: any) {
        return this.parser.parse(buffer);
    }

    setWasmPath(path: string) {
        this.state.api.SetWasmPath(path);
    }

    close(modelID: number, scene?: Scene){
        this.state.api.CloseModel(modelID);
        if(scene) scene.remove(this.state.models[modelID].mesh);
        delete this.state.models[modelID];
    }

    getExpressId(modelID: number, faceIndex: number) {
        return this.properties.getExpressId(modelID, faceIndex);
    }

    getAllItemsOfType(modelID: number, type: number) {
        return this.properties.getAllItemsOfType(modelID, type);
    }

    getItemProperties(modelID: number, id: number, recursive = false) {
        return this.properties.getItemProperties(modelID, id, recursive);
    }

    getPropertySets(modelID: number, id: number, recursive = false) {
        return this.properties.getPropertySets(modelID, id, recursive);
    }

    getTypeProperties(modelID: number, id: number, recursive = false) {
        return this.properties.getTypeProperties(modelID, id, recursive);
    }

    getSpatialStructure(modelID: number, recursive: boolean) {
        return this.properties.getSpatialStructure(modelID, recursive);
    }

    pickItem(items: Intersection[], pickTransparent = true) {
        return this.picker.pickItem(items, pickTransparent);
    }

    setItemsDisplay(modelID: number, items: number[], state: Display, scene: Scene) {
        this.display.setItemsDisplay(modelID, items, state, scene);
    }

    setModelDisplay(modelID: number, state: Display, scene: Scene){
        this.display.setModelDisplay(modelID, state, scene);
    }
}
