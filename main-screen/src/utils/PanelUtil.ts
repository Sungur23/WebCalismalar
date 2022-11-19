import {AbstractCartesianGraph} from "../gui/grafik/kartezyen/AbstractCartesianGraph";
import {GraphComponentType} from "./GraphParts";


export class PanelUtil {
    public static addListeners(canvas2d: HTMLCanvasElement, graphRef: AbstractCartesianGraph) {
        canvas2d.addEventListener("wheel", async (e) =>
            (await graphRef).zoomAt(e.deltaY > 0 ? 0.7071067811865475 : 1.414213562373095, e.offsetX, e.offsetY)
        );
        const dragging = {value: false};
        canvas2d.addEventListener("mousedown", async (e) => {
            dragging.value = true;
            const graph = await graphRef;
            graph.down(this.eventToPOJO(e));

        });
        canvas2d.addEventListener("mouseup", async (e) => {
            dragging.value = false;
            const graph = await graphRef;
            graph.up(this.eventToPOJO(e));
        });
        canvas2d.addEventListener(
            "mousemove",
            async (e) => {
                const graph = await graphRef;
                if (dragging.value) {
                    graph.dragged(this.eventToPOJO(e))
                } else {
                    const type = await graph.underCursorType(e.offsetX, e.offsetY);
                    if (type === GraphComponentType.HORIZONTAL_LINE) {
                        canvas2d.style.cursor = "row-resize"
                    } else if (type === GraphComponentType.VERTICAL_LINE) {
                        canvas2d.style.cursor = "col-resize"
                    } else {
                        canvas2d.style.cursor = "auto"
                    }
                }
            }
        );
    }

    public static eventToPOJO(e: any) {
        const obj: any = {};
        for (let k in e) {
            obj[k] = e[k];
        }
        return JSON.parse(JSON.stringify(obj, (k, v) => {
            if (v instanceof Node) return undefined;
            if (v instanceof Window) return undefined;
            return v;
        }, ' '));
    }
}