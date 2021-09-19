import { LoaderSettings, IfcGeometry, Vector, LoaderError, RawLineData, FlatMesh } from 'web-ifc';
import { IfcEventData, WebIfcAPI, WorkerActions } from './base-definitions-workers';

export class IfcWorkerHandler implements WebIfcAPI {
    private readonly workerPath: string;
    private ifcWorker: Worker;
    private requestID = 0;
    private rejectHandlers: any = {};
    private resolveHandlers: any = {};

    constructor(path: string) {
        this.workerPath = path;
        this.ifcWorker = new Worker(this.workerPath);
        this.ifcWorker.onmessage = (data: any) => this.handleResponse(data);
    }

    async Init() {
        return this.request(WorkerActions.Init);
    }

    async Close() {
        await this.request(WorkerActions.Close);
        this.ifcWorker.terminate();
    }

    async OpenModel(data: string | Uint8Array, settings?: LoaderSettings): Promise<number> {
        return this.request(WorkerActions.OpenModel, { data, settings });
    }

    async CreateModel(settings?: LoaderSettings): Promise<number> {
        return this.request(WorkerActions.CreateModel, { settings });
    }

    async ExportFileAsIFC(modelID: number): Promise<Uint8Array> {
        return this.request(WorkerActions.ExportFileAsIFC, { modelID });
    }

    async GetGeometry(modelID: number, geometryExpressID: number): Promise<IfcGeometry> {
        return this.request(WorkerActions.GetGeometry, { modelID, geometryExpressID });
    }

    async GetLine(modelID: number, expressID: number, flatten?: boolean): Promise<any> {
        return this.request(WorkerActions.GetLine, { modelID, expressID, flatten });
    }

    async GetAndClearErrors(modelID: number): Promise<Vector<LoaderError>> {
        return this.request(WorkerActions.GetAndClearErrors, { modelID });
    }

    async WriteLine(modelID: number, lineObject: any): Promise<void> {
        return this.request(WorkerActions.WriteLine, { modelID, lineObject });
    }

    async FlattenLine(modelID: number, line: any): Promise<void> {
        return this.request(WorkerActions.FlattenLine, { modelID, line });
    }

    async GetRawLineData(modelID: number, expressID: number): Promise<RawLineData> {
        return this.request(WorkerActions.GetRawLineData, { modelID, expressID });
    }

    async WriteRawLineData(modelID: number, data: RawLineData): Promise<any> {
        return this.request(WorkerActions.WriteRawLineData, { modelID, data });
    }

    async GetLineIDsWithType(modelID: number, type: number): Promise<Vector<number>> {
        return this.request(WorkerActions.GetLineIDsWithType, { modelID, type });
    }

    async GetAllLines(modelID: Number): Promise<Vector<number>> {
        return this.request(WorkerActions.GetAllLines, { modelID });
    }

    async SetGeometryTransformation(modelID: number, transformationMatrix: number[]): Promise<void> {
        return this.request(WorkerActions.SetGeometryTransformation, { modelID, transformationMatrix });
    }

    async GetCoordinationMatrix(modelID: number): Promise<number[]> {
        return this.request(WorkerActions.GetCoordinationMatrix, { modelID });
    }

    async GetVertexArray(ptr: number, size: number): Promise<Float32Array> {
        return this.request(WorkerActions.GetVertexArray, { ptr, size });
    }

    async GetIndexArray(ptr: number, size: number): Promise<Uint32Array> {
        return this.request(WorkerActions.GetIndexArray, { ptr, size });
    }

    async getSubArray(heap: any, startPtr: any, sizeBytes: any) {
        return this.request(WorkerActions.getSubArray, { heap, startPtr, sizeBytes });
    }

    async CloseModel(modelID: number): Promise<void> {
        return this.request(WorkerActions.CloseModel, { modelID });
    }

    async StreamAllMeshes(modelID: number, meshCallback: (mesh: FlatMesh) => void): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async StreamAllMeshesWithTypes(modelID: number, types: number[], meshCallback: (mesh: FlatMesh) => void): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async IsModelOpen(modelID: number): Promise<boolean> {
        return this.request(WorkerActions.IsModelOpen, { modelID });
    }

    async LoadAllGeometry(modelID: number): Promise<Vector<FlatMesh>> {
        return this.request(WorkerActions.LoadAllGeometry, { modelID });
    }

    async GetFlatMesh(modelID: number, expressID: number): Promise<FlatMesh> {
        return this.request(WorkerActions.GetFlatMesh, { modelID, expressID });
    }

    async SetWasmPath(path: string): Promise<void> {
        return this.request(WorkerActions.SetWasmPath, { path });
    }


    private request(action: WorkerActions, args?: any) {
        const data: IfcEventData = { action, args, id: this.requestID, result: undefined };

        return new Promise<any>((resolve, reject) => {
            this.resolveHandlers[this.requestID] = resolve;
            this.rejectHandlers[this.requestID] = reject;
            this.requestID++;
            this.ifcWorker.postMessage(data);
        });
    }

    private handleResponse(event: MessageEvent) {
        const data = event.data as IfcEventData;
        const id = data.id;

        try {
            this.resolveHandlers[id](data.result);
            console.log('Success!');
        } catch (error) {
            this.rejectHandlers[id](data.result);
            console.log('Error!');
        }
        delete this.resolveHandlers[id];
        delete this.rejectHandlers[id];
    }

}