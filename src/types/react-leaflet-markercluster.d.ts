declare module 'react-leaflet-markercluster' {
  import { Component, ReactNode } from 'react';
  import { MapLayerProps } from '@react-leaflet/core';
  import { MarkerClusterGroupOptions } from 'leaflet';

  export interface MarkerClusterGroupProps extends MapLayerProps, MarkerClusterGroupOptions {
    children?: ReactNode;
  }

  export default class MarkerClusterGroup extends Component<MarkerClusterGroupProps> {}
}
