declare module 'react-leaflet-markercluster' {
  import { Component, ReactNode } from 'react';
  import { MapLayerProps } from '@react-leaflet/core';

  export interface MarkerClusterGroupProps extends MapLayerProps {
    children?: ReactNode;
  }

  export default class MarkerClusterGroup extends Component<MarkerClusterGroupProps> {}
}
