import "maplibre-gl/dist/maplibre-gl.css";

import { featureCollection, point } from "@turf/turf";
import maplibregl from "maplibre-gl";
import { useMemo, useRef, useState } from "react";
import Map, {
  type ControlPosition,
  FullscreenControl,
  Layer,
  type MapRef,
  NavigationControl,
  Popup,
  ScaleControl,
  Source,
  useControl,
} from "react-map-gl/maplibre";

import { useResolvedTheme } from "@/components/providers/theme";
import type { GeoPoint } from "@/lib/data";
import { useChat } from "@/models/chat";

const DEFAULT_VIEW = {
  latitude: 47.98805,
  longitude: -1.74356,
  zoom: 5,
};

const POINT_STYLE = {
  "circle-radius": 5,
  "circle-color": "#e1121a",
};

function ProjectionControl({ position }: { position: ControlPosition }) {
  useControl(() => new maplibregl.GlobeControl(), { position });
  return null;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="font-mono font-bold">{label}</span>
      <span className="font-mono font-light">{value}</span>
    </div>
  );
}

function PointPopup({ point }: { point: GeoPoint }) {
  return (
    <>
      {point.label && (
        <div className="flex justify-center">
          <span className="font-mono font-bold">{point.label}</span>
        </div>
      )}
      <Row label="Lat" value={`${point.lat.toFixed(6)}°`} />
      <Row label="Lon" value={`${point.lon.toFixed(6)}°`} />
      {point.alt && <Row label="Alt" value={`${point.alt.toFixed(6)}m`} />}
    </>
  );
}

function MapWidget() {
  const ref = useRef<MapRef>(null);
  const theme = useResolvedTheme();
  const { toolCallIdToCatalogObjects } = useChat();
  const [hoveredPoint, setHoveredPoint] = useState<GeoPoint | null>(null);

  const points = useMemo(() => {
    const geoPoints = Object.values(toolCallIdToCatalogObjects)
      .flat()
      .filter((o): o is GeoPoint => o.type === "GeoPoint");
    return featureCollection(
      geoPoints.map((gp) => point([gp.lon, gp.lat], gp)),
    );
  }, [toolCallIdToCatalogObjects]);

  const handleMouseMove = (e: { features?: GeoJSON.Feature[] }) => {
    const feature = e.features?.[0];
    setHoveredPoint(feature ? (feature.properties as GeoPoint) : null);
  };

  const mapStyle =
    theme === "dark"
      ? `${import.meta.env.TILESERVER_URL}/${import.meta.env.MAP_DARK_STYLE_JSON}`
      : `${import.meta.env.TILESERVER_URL}/${import.meta.env.MAP_LIGHT_STYLE_JSON}`;

  return (
    <Map
      ref={ref}
      mapStyle={mapStyle}
      attributionControl={false}
      onMouseMove={handleMouseMove}
      initialViewState={DEFAULT_VIEW}
      interactiveLayerIds={["points-layer"]}
    >
      <Source type="geojson" id="points-source" data={points}>
        <Layer type="circle" id="points-layer" paint={POINT_STYLE} />
      </Source>

      <ScaleControl position="top-right" />
      <ScaleControl position="top-right" unit="imperial" />
      <ScaleControl position="top-right" unit="nautical" />
      <NavigationControl position="top-right" visualizePitch />
      <ProjectionControl position="top-right" />
      <FullscreenControl position="top-right" />

      {hoveredPoint && (
        <Popup
          closeButton={false}
          latitude={hoveredPoint.lat}
          longitude={hoveredPoint.lon}
        >
          <PointPopup point={hoveredPoint} />
        </Popup>
      )}
    </Map>
  );
}

export { MapWidget };
