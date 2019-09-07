import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApolloClient from 'apollo-boost';
import { YELP_API_KEY } from 'react-native-dotenv'
import { NavigationScreenProp } from 'react-navigation';

import { SearchBar } from 'react-native-elements';

const API_ENDPOINT: string = 'https://api.yelp.com/v3/graphql';
const COLORS = {
  red: '#d32323',
  grey: '#919191',
}

export default class HomeScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    client: ApolloClient<unknown>,
    search: string
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
        authorization: `Bearer ${YELP_API_KEY}`
      }
    });
    this.state = {
      client: client,
      search: '',
    };
  }

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  search = (value: string) => {
    this.setState({ search: "" })
    const { client } = this.state;
    this.props.navigation.navigate('Search', { client, value });
  };

  render() {
      const { search } = this.state;

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
          </View>
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
  },
  inputStyle: {
    color: COLORS.grey,
    fontSize: 16,
  }
})