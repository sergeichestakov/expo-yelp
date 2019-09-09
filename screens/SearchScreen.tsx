import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import ApolloClient from 'apollo-boost';

import Map from '../components/Map';
import ListView from '../components/ListView';
import { COLORS, DEFAULT_DELTA } from '../api/Constants';
import { QUERY_BUSINESSES_BY_TERM, QUERY_BUSINESSES_BY_CATEGORY } from '../api/Query';
import { Business, Coordinates, Region, ViewType } from '../api/Types';

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any, any>
  },
  { // state
    results: Business[],
    region: Region,
    showMapView: boolean,
  }> {
  static navigationOptions = ({ navigation }) => {
    const title = `Searching for ${navigation.getParam('value') || navigation.getParam('categoryTitle')}`;
    return {
      headerTitle: <Text style={styles.headerTitle}>{title}</Text>,
      headerStyle: {
        backgroundColor: COLORS.red,
        color: 'white',
      },
      headerTintColor: '#fff',

      headerRight: (
        <View style={{ paddingRight: 10 }}>
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
    };
  }

  async componentWillMount() {
    const { navigation } = this.props;

    const { longitude, latitude } : Coordinates = navigation.getParam('coordinates');
    const location: string = navigation.getParam('location', '');
    const categories: string | null = navigation.getParam('category', null);
    const client: ApolloClient<unknown> = navigation.getParam('client');
    const term: string = navigation.getParam('value');

    this.setState({ region: { longitude, latitude, ...DEFAULT_DELTA } });

    const query = categories === null ? QUERY_BUSINESSES_BY_TERM : QUERY_BUSINESSES_BY_CATEGORY;
    const variables = location.length ? { // Use user inputted location
      term,
      categories,
      location,
    } : { // Use current lat/lng
      term,
      categories,
      longitude,
      latitude,
    };

    client
      .query({ query, variables })
      .then((results) => {
        const businesses = results.data.search.business;
        this.setState({ results: businesses });

        // If the user inputted the location, center the map around the first result
        if (location.length) {
          const { coordinates } = businesses[0];
          const { latitude, longitude } = coordinates;
          this.setState({ region: { latitude, longitude, ...DEFAULT_DELTA } });
        }
      });
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({ switchView: this.switchView, buttonTitle: ViewType.MAP });
  }

  switchView = () => {
    const { showMapView } = this.state;
    const { navigation } = this.props;

    const prevTitle = navigation.getParam('buttonTitle');
    navigation.setParams({
      buttonTitle: prevTitle === ViewType.MAP
        ? ViewType.LIST
        : ViewType.MAP,
    });
    this.setState({ showMapView: !showMapView });
  }

  render() {
    const { results, region, showMapView } = this.state;
    if (results.length === 0) { // Loading
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      );
    }

    return showMapView
      ? <Map region={region} results={results} />
      : <ListView results={results} />;
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
});
