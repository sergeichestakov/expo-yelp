import React from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import { YELP_API_KEY } from 'react-native-dotenv';
import ApolloClient from 'apollo-boost';

import ListItem from '../components/ListItem';
import { QUERY_CATEGORIES } from '../api/Query';
import { API_ENDPOINT, COLORS, POPULAR_CATEGORIES } from '../api/Constants';
import { Category, Coordinates } from '../api/Types';

export default class HomeScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any, any>
  },
  { // state
    client: ApolloClient<unknown>,
    search: string,
    loading: boolean,
    location: string,
    coordinates: Coordinates,
    categories: Category[]
  }> {
  static navigationOptions = {
    headerStyle: {
      height: 0,
      backgroundColor: COLORS.red,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);

    const client = new ApolloClient({
      uri: API_ENDPOINT,
      headers: {
        authorization: `Bearer ${YELP_API_KEY}`,
      },
    });
    this.state = {
      client,
      search: '',
      location: '',
      loading: true,
      coordinates: null,
      categories: POPULAR_CATEGORIES,
    };
  }

  async componentWillMount() {
    this.getAllCategories();

    const coordinates = await this.getCurrentPosition();
    this.setState({ coordinates, loading: false });
  }

  async getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = Number.parseFloat(JSON.stringify(position.coords.latitude));
          const longitude = Number.parseFloat(JSON.stringify(position.coords.longitude));

          resolve({
            latitude,
            longitude,
          });
        },
      );
    });
  }

  getAllCategories = () => {
    const { client } = this.state;

    client
      .query({ query: QUERY_CATEGORIES })
      .then((results) => {
        const categories = results.data.categories.category;

        this.setState({ categories: this.state.categories.concat(categories) });
      });
  }

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  updateLocation = (location: string) => {
    this.setState({ location });
  };

  search = (value: string) => {
    const { client, location, coordinates } = this.state;

    if (value) {
      this.setState({ search: '', location: '' });
      this.props.navigation.navigate('Search', {
        client, value, location, coordinates,
      });
    }
  };

  renderItem(item: Category) {
    const { client, location, coordinates } = this.state;
    return (
      <ListItem
        alias={item.alias}
        client={client}
        coordinates={coordinates}
        title={item.title}
        location={location}
        navigation={this.props.navigation}
      />
    );
  }

  renderListOrLoading() {
    const { loading, categories } = this.state;
    if (loading) {
      return (
        <View style={{ top: 100 }}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      )
    }

    return (
      <FlatList
          data={categories}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          stickyHeaderIndices={[0, POPULAR_CATEGORIES.length - 1]}
        />
    )
  }

  render() {
    const { search, location } = this.state;

    return (
      <View>
        <View style={styles.searchBarView}>
          <SearchBar
            placeholder="Search for burgers, delivery, barbeque..."
            onChangeText={this.updateSearch}
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            platform="android"
            lightTheme
            onSubmitEditing={() => this.search(search)}
            value={search}
          />
          <SearchBar
            placeholder="Current Location"
            placeholderTextColor="blue"
            onChangeText={this.updateLocation}
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            searchIcon={null}
            platform="android"
            lightTheme
            onSubmitEditing={() => this.search(search)}
            value={location}
          />
        </View>
        {this.renderListOrLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBarView: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: COLORS.red,
  },
  containerStyle: {
    height: 50,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.lightgrey,
  },
  inputStyle: {
    color: 'black',
    fontSize: 16,
  },
});
