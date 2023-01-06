import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform} from 'react-native';
import MapViewDirections from "react-native-maps-directions";

const Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections
      lineCap="square"
      lineDashPattern={[0]}
      destination={destination}
      origin={origin}
      onReady={onReady}
      apikey="AIzaSyAQAGqFeeThBCPGZznbTg6QpcutU1nrDXA"
      strokeWidth={7}
      // strokeColor="#222"
      strokeColor="green"
      mode={'DRIVING'}
      resetOnChange={false}
      splitWaypoints={true}
    />
);

export default Directions