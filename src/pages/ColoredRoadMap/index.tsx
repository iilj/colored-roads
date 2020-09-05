import React from 'react';

import { default as OLMap } from 'ol/Map';
import { default as OLView } from 'ol/View';
import Style, { StyleFunction } from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorTile from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import Vector from 'ol/source/Vector';
import TopoJSON from 'ol/format/TopoJSON';
import { fromLonLat } from 'ol/proj';

import 'ol/ol.css';
import Feature, { FeatureLike } from 'ol/Feature';
import BaseLayer from 'ol/layer/Base';
import LineString from 'ol/geom/LineString';

import "./style.css";
import { hsl2rgb, RGB2ColorCode, calcAtanDeg, range } from "../../util/util";
import { FeatureObjectProps } from "../../interfaces/feature";

class WrappedMap extends React.Component {
  private mapContainer = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const zoomLevels = range(0, 19);
    const vecList = zoomLevels.map(() => new Vector({
      features: []
    }));
    // 空の new Style() を返すと何も描写しない
    const emptyStyle = new Style();
    const featuresLayerList = vecList.map((vec) => new VectorTile({
      source: vec,
      style: (
        feature: FeatureLike,
        resolution: number
      ) => {
        // ここで色を決める
        const properties = feature.getProperties() as FeatureObjectProps;
        if (properties.layer === 'roads') {
          const laglng = properties.geometry.flatCoordinates;
          const sz = laglng.length;
          const dx = laglng[sz - 2] - laglng[0];
          const dy = laglng[sz - 1] - laglng[1];
          const theta = calcAtanDeg(dx, dy);
          const rgb = hsl2rgb(theta * 4);
          const color = RGB2ColorCode(rgb.r, rgb.g, rgb.b);
          return new Style({
            stroke: new Stroke({
              width: 1,
              color: color
            })
          });
        }
        else {
          return emptyStyle;
        }
      }
    }));
    let curZoom = 10;
    const hashList = zoomLevels.map(() => new Set<string>());

    const waterStyle = new Style({
      fill: new Fill({
        color: '#9db9e8',
      }),
    });
    const railStype = new Style({
      stroke: new Stroke({
        color: '#000',
        width: 2
      }),
    });

    const styleFunction: StyleFunction = (
      feature: FeatureLike,
      resolution: number
    ) => {
      // RenderFeature から properties を取得
      const properties = feature.getProperties() as FeatureObjectProps;
      // properties に格納されているレイヤ名からスタイルを書き分ける
      if (properties.layer === 'roads') {
        const laglng = properties.geometry.flatCoordinates;
        const sz = laglng.length / 2 - 1;
        const key = laglng.join();
        if (hashList[curZoom].has(key)) {
          return emptyStyle;
        }
        // if (properties.bus_network !== undefined) { // バス路線を除外
        //   return emptyStyle;
        // }
        if (properties.kind === 'aeroway' || properties.kind === 'ferry') {
          return emptyStyle;
        }
        hashList[curZoom].add(key);
        if (properties.kind === 'rail') {
          return railStype;
        }
        if (properties.kind !== 'major_road'
          && properties.kind !== 'minor_road'
          && properties.kind !== 'highway'
          && properties.kind !== 'path'
          && properties.kind !== 'construction') {
          return emptyStyle;
        }

        const endIndices = new Set<number>();
        if (properties.geometry.ends_ !== undefined) {
          properties.geometry.ends_.forEach((num) => {
            endIndices.add(num - 1);
          })
        }
        for (let i = 0; i < sz; ++i) {
          if (endIndices.has(2 * i + 1)) continue;
          const routeFeature = new Feature({
            layer: 'roads',
            geometry: new LineString([[laglng[2 * i], laglng[2 * i + 1]], [laglng[2 * i + 2], laglng[2 * i + 3]]]),
            origin: properties
          });
          vecList[curZoom].addFeature(routeFeature);
        }

        return emptyStyle;
      } else if (properties.layer === 'water') {
        return waterStyle;
      } else {
        return emptyStyle;
      }
    };
    const vectorTileLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new TopoJSON({
          layerName: 'layer',
          layers: ['water', 'roads', 'buildings'],
        }),
        url: 'https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=z_YNM3cKSlyZmpn4pSlQlQ',
        attributions: [
          '&copy; OpenStreetMap,',
          '<a href="https://github.com/iilj/colored-roads">@iilj</a>'
        ],
        // minZoom: 10,
        maxZoom: 19
      }),
      // minZoom: 10,
      // maxZoom: 12,
      style: styleFunction
    });

    // create feature layer and vector source
    const layers = [vectorTileLayer] as BaseLayer[];
    featuresLayerList.forEach((featuresLayer) => {
      layers.push(featuresLayer);
    });

    // create map object with feature layer
    const map = new OLMap({
      target: this.mapContainer.current as HTMLDivElement,
      view: new OLView({
        center: fromLonLat([139.767125, 35.681236]),
        zoom: curZoom,
      }),
      layers: layers,
    });

    map.getView().setConstrainResolution(true);
    map.getView().on('change:resolution', (event) => {
      const zoom = map.getView().getZoom();
      if (zoom !== curZoom && zoom % 1 === 0) {
        // vc.clear();
        // vecList.forEach((vc, index) => {
        //   if (index != zoom) vc.clear();
        // });
        featuresLayerList.forEach((featuresLayer, index) => {
          featuresLayer.setVisible(index === zoom);
        });
        curZoom = zoom;
      }
    });

    // save map and layer references to local state
    this.setState({
      map: map,
      // featuresLayer: featuresLayer
    });
  }

  render() {
    return (
      <>
        <h1>道路を方角ごとに着色するやつ</h1>
        <div ref={this.mapContainer} className='colored-road-map-container'></div>
      </>
    );
  }
};

export const ColoredRoadMap: React.FC = () => {
  return (
    <>
      <WrappedMap />
    </>
  )
};