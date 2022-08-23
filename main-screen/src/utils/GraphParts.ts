import Myr from "./myr";

export enum AxisVisualType {
    POINT, LINE
}

export enum GraphComponentType {
    HORIZONTAL_LINE,
    VERTICAL_LINE,
    AXIS
}

export abstract class Shape {
    public abstract contains(x: number, y: number): boolean
}

export class Rectangle extends Shape {

    constructor(public x: number, public y: number, public width: number, public height: number) {
        super()
    }

    public contains(x: number, y: number): boolean {
        return this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height
    }
}

export type Graphics2D = CanvasRenderingContext2D

export type GraphComponentMoved = (interacting: boolean, movedId: string, axisValues: { [componentId: string]: { [axisId: string]: number } }) => void

export abstract class GraphComponent2D {
    public myrColor: Myr.Color

    constructor(public id: string, public hexColor: string = "#FFFFFF") {
        this.myrColor = Myr.Color.fromHex(hexColor);
    }

    public drawCanvas(graph: Graph): Shape | undefined {
        return undefined
    }

    public moveTo(xRatio: number, yRatio: number) {

    }

    public ratios(): (number | undefined)[] {
        return [undefined, undefined]
    }

    public abstract type(): GraphComponentType
}

export class Axis extends GraphComponent2D {

    constructor(public name: string, public unit: string, public id: string,
                public hexColor: string = "#FFFFFF", public visualType = AxisVisualType.POINT,
                public range?: [number, number], public angle?: number) {
        super(name, hexColor)
    }

    public static copy(axis: Axis) {
        return new Axis(axis.name, axis.unit, axis.id, axis.hexColor, axis.visualType, axis.range, axis.angle);
    }

    toRatio(value: number) {
        return (value - this.range![0]) / (this.range![1] - this.range![0])
    }

    toValue(ratio: number) {
        return ratio * (this.range![1] - this.range![0]) + this.range![0]
    }

    public type(): GraphComponentType {
        return GraphComponentType.AXIS
    }
}

export class Dimension {
    constructor(public readonly width: number = Number.NaN, public readonly height: number = Number.NaN) {
    }
}

export interface Graph {
    graphics2d(): Graphics2D

    ratioToX(value: number): number

    ratioToY(value: number): number
}

export class VerticalLine extends GraphComponent2D {
    constructor(public id: string, public ratio: number, public hexColor: string = "#FFFFFF", public axisId: string = "") {
        super(id, hexColor)
    }

    public drawCanvas(graph: Graph) {
        const graphics = graph.graphics2d()
        graphics.lineWidth = 2
        graphics.strokeStyle = this.hexColor;
        const x = graph.ratioToX(this.ratio);
        graphics.setLineDash([6, 6]);
        graphics.beginPath()
        graphics.moveTo(x, 0);
        graphics.lineTo(x, graphics.canvas.height);
        graphics.stroke();
        return new Rectangle(x - 2, 0, 4, graphics.canvas.height)
    }

    public moveTo(xRatio: number, yRatio: number): void {
        this.ratio = xRatio;
    }

    public ratios(): (number | undefined)[] {
        return [this.ratio, undefined]
    }

    public type(): GraphComponentType {
        return GraphComponentType.VERTICAL_LINE
    }
}

export class HorizontalLine extends GraphComponent2D {
    constructor(public id: string, public ratio: number, public hexColor: string = "#FFFFFF", public axisId: string = "") {
        super(id, hexColor)
    }

    public drawCanvas(graph: Graph) {
        const graphics = graph.graphics2d()
        graphics.lineWidth = 2
        graphics.strokeStyle = this.hexColor;
        const y = graph.ratioToY(this.ratio);
        graphics.setLineDash([6, 6]);
        graphics.beginPath()
        graphics.moveTo(0, y);
        graphics.lineTo(graphics.canvas.width, y);
        graphics.stroke();
        return new Rectangle(0, y - 2, graphics.canvas.width, 4)
    }

    public ratios(): (number | undefined)[] {
        return [undefined, this.ratio]
    }

    public moveTo(xRatio: number, yRatio: number): void {
        this.ratio = yRatio;
    }

    public type(): GraphComponentType {
        return GraphComponentType.HORIZONTAL_LINE
    }
}

export function randomColor() {
    return randomColors[(Math.random() * randomColors.length) | 0]
}

export const randomColors = [
    "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
    "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
    "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
    "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
    "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
    "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
    "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
    "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
    "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
    "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
    "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
    "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
    "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C",
    "#83AB58", "#001C1E", "#D1F7CE", "#004B28", "#C8D0F6", "#A3A489", "#806C66", "#222800",
    "#BF5650", "#E83000", "#66796D", "#DA007C", "#FF1A59", "#8ADBB4", "#1E0200", "#5B4E51",
    "#C895C5", "#320033", "#FF6832", "#66E1D3", "#CFCDAC", "#D0AC94", "#7ED379", "#012C58",
    "#7A7BFF", "#D68E01", "#353339", "#78AFA1", "#FEB2C6", "#75797C", "#837393", "#943A4D",
    "#B5F4FF", "#D2DCD5", "#9556BD", "#6A714A", "#001325", "#02525F", "#0AA3F7", "#E98176",
    "#DBD5DD", "#5EBCD1", "#3D4F44", "#7E6405", "#02684E", "#962B75", "#8D8546", "#9695C5",
    "#E773CE", "#D86A78", "#3E89BE", "#CA834E", "#518A87", "#5B113C", "#55813B", "#E704C4",
    "#00005F", "#A97399", "#4B8160", "#59738A", "#FF5DA7", "#F7C9BF", "#643127", "#513A01",
    "#6B94AA", "#51A058", "#A45B02", "#1D1702", "#E20027", "#E7AB63", "#4C6001", "#9C6966",
    "#64547B", "#97979E", "#006A66", "#391406", "#F4D749", "#0045D2", "#006C31", "#DDB6D0",
    "#7C6571", "#9FB2A4", "#00D891", "#15A08A", "#BC65E9", "#FFFFFE", "#C6DC99", "#203B3C",
    "#671190", "#6B3A64", "#F5E1FF", "#FFA0F2", "#CCAA35", "#374527", "#8BB400", "#797868",
    "#C6005A", "#3B000A", "#C86240", "#29607C", "#402334", "#7D5A44", "#CCB87C", "#B88183",
    "#AA5199", "#B5D6C3", "#A38469", "#9F94F0", "#A74571", "#B894A6", "#71BB8C", "#00B433",
    "#789EC9", "#6D80BA", "#953F00", "#5EFF03", "#E4FFFC", "#1BE177", "#BCB1E5", "#76912F",
    "#003109", "#0060CD", "#D20096", "#895563", "#29201D", "#5B3213", "#A76F42", "#89412E",
    "#1A3A2A", "#494B5A", "#A88C85", "#F4ABAA", "#A3F3AB", "#00C6C8", "#EA8B66", "#958A9F",
    "#BDC9D2", "#9FA064", "#BE4700", "#658188", "#83A485", "#453C23", "#47675D", "#3A3F00",
    "#061203", "#DFFB71", "#868E7E", "#98D058", "#6C8F7D", "#D7BFC2", "#3C3E6E", "#D83D66",
    "#2F5D9B", "#6C5E46", "#D25B88", "#5B656C", "#00B57F", "#545C46", "#866097", "#365D25",
    "#252F99", "#00CCFF", "#674E60", "#FC009C", "#92896B", "#1E2324", "#DEC9B2", "#9D4948",
    "#85ABB4", "#342142", "#D09685", "#A4ACAC", "#00FFFF", "#AE9C86", "#742A33", "#0E72C5",
    "#AFD8EC", "#C064B9", "#91028C", "#FEEDBF", "#FFB789", "#9CB8E4", "#AFFFD1", "#2A364C",
    "#4F4A43", "#647095", "#34BBFF", "#807781", "#920003", "#B3A5A7", "#018615", "#F1FFC8",
]