import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";
import { YELP_API_KEY } from 'react-native-dotenv'

const API_ENDPOINT: string = 'https://api.yelp.com/v3/graphql';

export default class HomeScreen extends React.Component<{}, { client: ApolloClient<unknown> }> {
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
    };
  }
  render() {
    this.state.client
      .query({
        query: gql`
          {
            business(id: "garaje-san-francisco") {
              name
              id
              alias
              rating
              url
            }
          }
        `
      })
      .then(result => console.log(result));
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Home Screen</Text>
        </View>
      );
    }
}