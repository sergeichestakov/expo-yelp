import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button, ScrollView, Image, Dimensions } from 'react-native';
import { Card, Icon } from 'react-native-elements'
import { NavigationScreenProp } from 'react-navigation';
import ApolloClient from "apollo-boost";

import Map from '../components/Map';
import { COLORS, DEFAULT_DELTA } from '../api/Constants';
import { QUERY_BUSINESSES_BY_TERM, QUERY_BUSINESSES_BY_CATEGORY } from '../api/Query';
import { Business, Coordinates, Region } from '../api/Types';

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    results: Business[],
    region: Region,
    showMapView: boolean,
    isMapReady: boolean,
  }> {
  static navigationOptions = ({ navigation }) => {
    const title = `Searching for ${navigation.getParam('value') || navigation.getParam('categoryTitle')}`
    return {
      headerTitle: <Text style={styles.headerTitle}>{title}</Text>,
      headerStyle: {
        backgroundColor: COLORS.red,
        color: 'white',
      },
      headerTintColor: '#fff',

      headerRight: (
        <View style={{paddingRight: 10}}>
          <Button
            onPress={navigation.getParam('switchView')}
            title={navigation.getParam('buttonTitle', 'Map')}
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

    this.setState({region: { longitude, latitude, ...DEFAULT_DELTA }})

    const { navigation } = this.props;
    const location: string = navigation.getParam('location', "");
    const category: string | null = navigation.getParam('category', null);
    const client: ApolloClient<unknown> = navigation.getParam('client');
    const term: string = navigation.getParam('value');

    const query = category === null ? QUERY_BUSINESSES_BY_TERM : QUERY_BUSINESSES_BY_CATEGORY;

    const variables = {
      term,
      location,
      longitude,
      latitude,
    }

    client
    .query({ query, variables })
    .then(results => {
      const businesses = results.data.search.business;
      this.setState({results: businesses});

      // If the user inputted the location, center the map around the first result
      if (location.length) {
        const { coordinates } = businesses[0];
        const { latitude, longitude } = coordinates;
        this.setState({region: { latitude, longitude, ...DEFAULT_DELTA }});
      }
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({ switchView: this.switchView, buttonTitle: 'Map' });
  }

  switchView = () => {
    const { showMapView } = this.state;

    const prevTitle = this.props.navigation.getParam('buttonTitle');
    this.props.navigation.setParams({buttonTitle: prevTitle === 'Map' ? 'List' : 'Map'});
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

  renderStarIcons(rating: number, review_count: number) {
    const icons = []
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
          {this.renderStarIcons(result.rating, result.review_count)}
          <Text>
            {result.location.address1}, {result.location.city}
          </Text>
          <Text style={{marginBottom: 10}}>
            {(result.distance / 1000).toFixed(1)} km away
          </Text>
        </Card>
      );
    })
  }

  render() {
    const { results, region, showMapView } = this.state;
    if (results.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      )
    }

    if (showMapView) {
      return (
        <Map region={region} results={results} />
      )
    } else { // Show ListView
      return (
        <ScrollView style={{ flex: 1 }}>
          {this.renderResults(results)}
        </ScrollView>
      );
    }
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