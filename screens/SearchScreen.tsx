import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import ApolloClient from "apollo-boost";

import Map from '../components/Map';
import ListView from '../components/ListView';
import { COLORS, DEFAULT_DELTA } from '../api/Constants';
import { QUERY_BUSINESSES_BY_TERM, QUERY_BUSINESSES_BY_CATEGORY } from '../api/Query';
import { Business, Coordinates, Region, ViewType } from '../api/Types';

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    results: Business[],
    region: Region,
    showMapView: boolean,
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
            title={navigation.getParam('buttonTitle', ViewType.MAP)}
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
    this.props.navigation.setParams({ switchView: this.switchView, buttonTitle: ViewType.MAP });
  }

  switchView = () => {
    const { showMapView } = this.state;

    const prevTitle = this.props.navigation.getParam('buttonTitle');
    this.props.navigation.setParams({buttonTitle: prevTitle === ViewType.MAP ? ViewType.LIST : ViewType.MAP});
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

  render() {
    const { results, region, showMapView } = this.state;
    if (results.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      )
    }

    return showMapView ?
      <Map region={region} results={results} /> :
      <ListView results={results}/>;
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
});