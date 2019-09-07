import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApolloClient from 'apollo-boost';
import { YELP_API_KEY } from 'react-native-dotenv'
import { NavigationScreenProp } from 'react-navigation';

import { SearchBar } from 'react-native-elements';

const API_ENDPOINT: string = 'https://api.yelp.com/v3/graphql';

export default class HomeScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    client: ApolloClient<unknown>,
    search: string
  }> {
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

  updateSearch = search => {
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
        <SearchBar
          placeholder="Search for food"
          onChangeText={this.updateSearch}
          lightTheme
          onSubmitEditing={() => this.search(search)}
          value={search}
        />
      );
    }
}