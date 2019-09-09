import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Business, Region } from '../api/Types';

const { width, height } = Dimensions.get('window');

export default class Map extends React.Component<
  { // props
    region: Region,
    results: Business[],
  },
  { // state
    isMapReady: boolean
  }> {
  constructor(props) {
    super(props);

    this.state = {
      isMapReady: false,
    };
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }

  render() {
    const { results, region } = this.props;

    return (
      <View style={styles.map}>
        <MapView
          region={region}
          onLayout={this.onMapLayout}
          style={styles.map}
        >
          {this.state.isMapReady && results.map((result, index) => (
            <Marker
              coordinate={result.coordinates}
              key={index}
              title={result.name}
              description={`${result.rating} Stars from ${result.review_count} Reviews`}
            />
          ))}
        </MapView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width,
    height,
  },
});
