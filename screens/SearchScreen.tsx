import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { gql } from "apollo-boost";

type Location = {
  address1: string,
  city: string,
  state: string,
}

type Business = {
  name: string,
  rating: number,
  review_count: number,
  distance: number,
  photos: string,
  url: string,
  location: Location,
}

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    results: Business[],
  }> {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    }
  }

  async componentWillMount() {
    const { location, longitude, latitude } = await this.getCurrentPosition();

    const { navigation } = this.props;
    const client = navigation.getParam('client');
    const value: string = navigation.getParam('value');

    const locationString = location !== null ?
      `location: "${location}"` :
      `longitude: ${longitude}\nlatitude: ${latitude}`

    const query = gql`
    {
      search(term: "${value}",
            ${locationString}) {
        total
        business {
            name
            rating
            review_count
            distance
            photos
            url
            location {
              address1
              city
              state
            }
        }
      }
    }
    `;
    client
    .query({ query })
    .then(results => this.setState({results}));
  }

  async getCurrentPosition(): Promise<any> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = JSON.stringify(position.coords.latitude);
          const longitude = JSON.stringify(position.coords.longitude);

          const { navigation } = this.props;
          const location = navigation.getParam('location', null);

          resolve({
            latitude,
            longitude,
            location,
          });
        }
      );
    });
  }

  render() {
    const { results } = this.state;
    if (results.length === 0) {
      return (
        <Text>Loading...</Text>
      )
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search Screen</Text>
      </View>
    );
  }
}