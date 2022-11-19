import PPIGraph from "./PPIGraph";
import {PPILineModel} from "../../../api/SimulationAPI";


export default class PPIRadarVideoWorker {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private ppiGraph: PPIGraph

    public constructor(ppiGraph: PPIGraph) {
        this.canvas = ppiGraph.canvasRadarVideo
        this.ctx = ppiGraph.radarVideo
        this.ppiGraph = ppiGraph
    }

    public drawRadarVideoAll(lineModel: PPILineModel[]) {
        this.ppiGraph.clearRadarVideo()
        if (lineModel && lineModel.length > 0) {
            for (let i = 0; i < lineModel.length; i += 1) {
                this.ppiGraph.drawRadarVideo(i, lineModel[i].rgbArray!)
            }
        }
    }

}