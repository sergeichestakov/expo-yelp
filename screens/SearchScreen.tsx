import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button, ScrollView, Image, Dimensions } from 'react-native';
import { Card, Icon } from 'react-native-elements'
import { NavigationScreenProp } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import { gql } from "apollo-boost";

type Location = {
  address1: string,
  city: string,
  state: string,
}

type Coordinates = {
  longitude: number,
  latitude: number,
}

type Business = {
  name: string,
  rating: number,
  review_count: number,
  distance: number,
  photos: string,
  url: string,
  location: Location,
  coordinates: Coordinates,
}

const COLORS = {
  red: '#d32323',
}

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    results: Business[],
    region: {
      latitude: number,
      longitude: number,
      latitudeDelta: number,
      longitudeDelta: number,
    } | null,
    showMapView: boolean,
    isMapReady: boolean,
  }> {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text style={styles.headerTitle}>Searching for {navigation.getParam('value')}</Text>,
      headerStyle: {
        backgroundColor: COLORS.red,
        color: 'white',
      },
      headerTintColor: '#fff',

      headerRight: (
        <View style={{paddingRight: 10}}>
          <Button
            onPress={navigation.getParam('switchView')}
            title={navigation.getParam('title', 'Map')}
            color={COLORS.red}
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      region: null,
      showMapView: false,
      isMapReady: false,
    }
  }

  async componentWillMount() {
    const { longitude, latitude } = await this.getCurrentPosition();

    this.setState({region: { longitude, latitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }})

    const { navigation } = this.props;
    const location = navigation.getParam('location', null);
    const client = navigation.getParam('client');
    const value: string = navigation.getParam('value');

    const locationString = location !== null ?
      `location: "${location}"` :
      `longitude: ${longitude}\nlatitude: ${latitude}`

    const query = gql`
    {
      search(term: "${value}",
            ${locationString}) {
        total
        business {
            name
            rating
            review_count
            distance
            photos
            url
            location {
              address1
              city
              state
            }
            coordinates {
              latitude
              longitude
            }
        }
      }
    }
    `;
    client
    .query({ query })
    .then(results => this.setState({results: results.data.search.business}));
  }

  componentDidMount() {
    this.props.navigation.setParams({ switchView: this.switchView, title: 'Map' });
  }

  switchView = () => {
    const { showMapView } = this.state;

    const prevTitle = this.props.navigation.getParam('title');
    this.props.navigation.setParams({title: prevTitle === 'Map' ? 'List' : 'Map'});
    this.setState({showMapView: !showMapView});
  }

  async getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = Number.parseFloat(JSON.stringify(position.coords.latitude));
          const longitude = Number.parseFloat(JSON.stringify(position.coords.longitude));

          resolve({
            latitude,
            longitude
          });
        }
      );
    });
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }

  renderMap() {
    return (
      <MapView
        region={this.state.region}
        style={styles.map}
        onLayout={this.onMapLayout}
      >
        {this.state.isMapReady && this.state.results.map((result, index) => (
          <Marker
            coordinate={result.coordinates}
            key={index}
            title={result.name}
            description={`${result.rating} Stars from ${result.review_count} Reviews`}
          />
        ))}
      </ MapView>
    )
  }

  createStarIcons(rating: number, review_count: number) {
    const icons = []
    console.log(rating)
    for (let star = 1; star <= rating; star++) {
      icons.push(
      <Icon
        name = 'star'
        key={star}
        type='font-awesome'
        />
      )
    }
    if (!Number.isInteger(rating)) {
      icons.push(
        <Icon
          name = 'star-half'
          key={6}
          type='font-awesome'
          />
        )
    }
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        {icons}
        <Text> {review_count} Reviews</Text>
      </View>
    )
  }

  renderResults(results) {
    return results.map((result, index) => {
      const title = `${index + 1}. ${result.name}`;
      console.log(result.photos)
      return (
        <Card
          title={title}
          titleStyle={styles.title}
          containerStyle={{flexDirection: 'row'}}
          key={index}>
          <Image
            style={{width: 50, height: 50}}
            source={{uri: result.photos[0]}}
          />
          {this.createStarIcons(result.rating, result.review_count)}
          <Text>
            {result.location.address1}, {result.location.city}
          </Text>
          <Text style={{marginBottom: 10}}>
            {(result.distance / 1000).toFixed(0)} km away
          </Text>
        </Card>
      );
    })
  }

  render() {
    const { results, showMapView } = this.state;
    if (results.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      )
    }

    if (showMapView) {
      return (
        <View style={styles.map}>
          {this.renderMap()}
        </View>
      )
    }

    return (
      <ScrollView style={{ flex: 1 }}>
        {this.renderResults(results)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});