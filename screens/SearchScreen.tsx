import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { gql } from "apollo-boost";

export default class SearchScreen extends React.Component<{ navigation: NavigationScreenProp<any,any> }, {}> {
  constructor(props) {
    super(props);

    this.state = {
      result: {}
    }
  }
  render() {
    const { navigation } = this.props;
    const client = navigation.getParam('client');
    const value = navigation.getParam('value');
    client
    .query({
      query: gql`
      {
        search(term: "${value}",
              location: "san francisco",
              limit: 5) {
          total
          business {
              name
              url
          }
        }
      }
      `
    })
    .then(result => console.log(result));

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search Screen</Text>
      </View>
    );
  }
}