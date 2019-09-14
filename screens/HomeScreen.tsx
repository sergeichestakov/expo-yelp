import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { SearchBar } from 'react-native-elements';

import CategoriesList from '../components/CategoriesList';
import { COLORS, POPULAR_CATEGORIES } from '../api/Constants';
import { Category, Coordinates } from '../api/Types';

export default class HomeScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any, any>
  },
  { // state
    search: string,
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

    this.state = {
      search: '',
      location: '',
      error: false,
      coordinates: null,
      categories: POPULAR_CATEGORIES,
    };
  }

  async componentDidMount() {
    const coordinates = await this.getCurrentPosition();
    this.setState({ coordinates });
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

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  updateLocation = (location: string) => {
    this.setState({ location });
  };

  search = (value: string) => {
    const { location, coordinates } = this.state;

    if (value) {
      this.setState({ search: '', location: '' });
      this.props.navigation.navigate('Search', {
        value, location, coordinates,
      });
    }
  };

  render() {
    const { search, location, coordinates } = this.state;

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
        <CategoriesList
          coordinates={coordinates}
          location={location}
          navigation={this.props.navigation}
        />
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
