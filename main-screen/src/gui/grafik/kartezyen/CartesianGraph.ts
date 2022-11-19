import {AbstractXYGraph} from "./AbstractXYGraph";


export default class CartesianGraph extends AbstractXYGraph {
    public xRatioToLabel(ratio: number): number {
        return ratio * (this.xAxis.range![1] - this.xAxis.range![0]) + this.xAxis.range![0]
        // return this.xAxis.toValue(ratio)
    }

    public valueToX(value: number): number {
        return this.ratioToX((value - this.xAxis.range![0]) / (this.xAxis.range![1] - this.xAxis.range![0]));
        // return this.ratioToX(this.xAxis.toRatio(value));
    }
}