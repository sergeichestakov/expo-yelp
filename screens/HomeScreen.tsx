import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text, FlatList } from 'react-native';
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
    error: boolean,
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
        'Accept-Language': 'en_US',
      },
    });

    this.state = {
      client,
      search: '',
      location: '',
      loading: true,
      error: false,
      coordinates: null,
      categories: POPULAR_CATEGORIES,
    };
  }

  async componentDidMount() {
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

        this.setState({ categories: this.state.categories.concat(categories), error: false });
      })
      .catch(error => {
        console.log("Whoops something went wrong: ", error);
        this.setState({ error: true });
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

  renderCategoriesOrLoading() {
    const { loading, categories, error } = this.state;
    if (loading) {
      return (
        <View style={{ top: 100 }}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      )
    }

    if (error) {
      return (
        <View style={{ top: 5 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Whoops something went wrong.</Text>
          <Text>Please check your network connection and try again later.</Text>
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
        {this.renderCategoriesOrLoading()}
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
