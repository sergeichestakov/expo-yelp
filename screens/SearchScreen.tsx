import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { gql } from "apollo-boost";

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    location: string,
    longitude: string,
    latitude: string,
  }> {
  constructor(props) {
    super(props);

    this.state = {
      location: "",
      longitude: null,
      latitude: null,
    }
  }

  componentWillMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        const { navigation } = this.props;
        const location = navigation.getParam('location', "");

        this.setState({
          latitude,
          longitude,
          location,
        });
      }
    );
  }

  render() {
    const { navigation } = this.props;
    const client = navigation.getParam('client');
    const value: string = navigation.getParam('value');

    // Either location is empty or long/lat is empty
    const { location, longitude, latitude } = this.state;

    if (longitude === null) {
      return (<Text>Loading</Text>)
    }

    const query = gql`
    {
      search(term: "${value}",
            location: "${location}",
            longitude: ${longitude},
            latitude: ${latitude},
            limit: 5) {
        total
        business {
            name
            url
        }
      }
    }
    `
    client
    .query({ query })
    .then(result => console.log(result));

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search Screen</Text>
      </View>
    );
  }
}