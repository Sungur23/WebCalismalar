import React, {Component} from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import {Draw} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {Heatmap} from "ol/layer";


const source = new VectorSource({wrapX: false});
const vector = new VectorLayer({
    source: source
});

class PublicMap extends Component {
    constructor(props) {
        super(props);

        // this.state = {center: fromLonLat([32.815, 39.718]), zoom: 16};

        this.state = {center: fromLonLat([32.815, 39.918]), zoom: 10};

        this.olmap = new OlMap({
            target: null,
            layers: [
                new OlLayerTile({
                    // source: new OlSourceOSM
                    source: new XYZ({
                        // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        // url: 'http://localhost:80/Road/{z}/{x}/{y}.png'

                        //roadmap
                        // url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'

                        //terrain
                        // url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}'

                        //Altered roadmap
                        // url: 'http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}'

                        //Satellite only
                        // url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'

                        //Terrain only
                        // url: 'http://mt0.google.com/vt/lyrs=t&hl=en&x={x}&y={y}&z={z}'

                        //Hybrid
                        url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
                    })
                }),
                vector
            ],
            view: new OlView({
                center: this.state.center,
                zoom: this.state.zoom,
                // maxZoom: this.state.zoom * 3 / 2,
                // minZoom: this.state.zoom / 2
            })
        });
        this.drawObject();
    }

    drawObject(pos) {

        var point = new Feature({
            geometry: new Point(fromLonLat([32.815, 39.918])),
            weight: 20
        });
        source.addFeature(point);

        point.getGeometry().setCoordinates(fromLonLat([32.815, 39.918]));

        // let draw = new Draw({
        //     source: source,
        //     type: "Point"
        // });
        // this.olmap.addInteraction(draw);
    }

    updateMap() {
        this.olmap.getView().setCenter(this.state.center);
        this.olmap.getView().setZoom(this.state.zoom);
    }

    componentDidMount() {
        this.olmap.setTarget("map");

        // Listen to map changes
        this.olmap.on("moveend", () => {
            let center = this.olmap.getView().getCenter();
            let zoom = this.olmap.getView().getZoom();
            this.setState({center, zoom});
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let center = this.olmap.getView().getCenter();
        let zoom = this.olmap.getView().getZoom();
        if (center === nextState.center && zoom === nextState.zoom) return false;
        return true;
    }

    userAction() {
        this.setState({center: fromLonLat([32.78, 39.82]), zoom: 12});
    }

    render() {
        this.updateMap(); // Update map on render?
        return (
            <div id="map" style={{width: "100%", height: "100%"}}>
                {/*<button onClick={e => this.userAction()}>setState on click</button>*/}
            </div>
        );
    }
}

export default PublicMap;