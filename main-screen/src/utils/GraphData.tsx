export class GraphData {
    x: number[] = [];
    y: number[] = [];
    base: number[] = [];
    index: { [key: string]: number } = {};
    minX = Number.POSITIVE_INFINITY
    maxX = Number.NEGATIVE_INFINITY
    minY = Number.POSITIVE_INFINITY
    maxY = Number.NEGATIVE_INFINITY

    insertTimeBatch = (time: number[], value: number[]) => {
        for (let i = 0; i < time.length; i++) {
            const t = time[i];
            const v = value[i];
            this.minX = Math.min(this.minX, t)
            this.maxX = Math.max(this.maxX, t)
            this.minY = Math.min(this.minY, v)
            this.maxY = Math.max(this.maxY, v)
        }

        this.x = time.concat(this.x)
        this.y = this.y.concat(value);
    }

    clear = () => {
        this.x = [];
        this.y = [];
    }

    getX = (i: number): number => {
        return this.x[0];
    }

    getY = (i: number): number => {
        return this.y[0];
    }


    setData(d: GraphData) {
        this.x = d.x;
        this.y = d.y;
    }
}
