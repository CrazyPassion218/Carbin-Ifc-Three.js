import {
	BufferGeometry,
	Loader,
	LoadingManager,
	Scene,
	Material
} from 'three';

interface SpatialStructureElement {
	hasChildren: number[];
	hasSpatialChildren: SpatialStructureElement[];
}

export class IFCLoader extends Loader {

	constructor( manager?: LoadingManager );
	setWasmPath(path: string): void;

	getExpressId(faceIndex: number): number;
	getItemProperties(expressId: number, all: boolean): any;
	highlightItems(expressIds: number[], scene: Scene, material: Material ): void;
	setItemsVisibility(expressIds: number[], geometry: BufferGeometry, visible: boolean ): void;
	getSpatialStructure(): SpatialStructureElement;

	load( url: string, onLoad: ( geometry: BufferGeometry ) => void, onProgress?: ( event: ProgressEvent ) => void, onError?: ( event: ErrorEvent ) => void ): void;
	parse( data: ArrayBuffer ): BufferGeometry;
	getIfcItemInformation(expressID: number): object;
}