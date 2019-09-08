import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
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

const COLORS = {
  red: '#d32323',
  grey: '#919191',
}

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    results: Business[],
  }> {
  static navigationOptions = {
    headerStyle: {
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
    .then(results => this.setState({results: results.data.search.business}));
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

  createStarIcons(rating: number, review_count: number) {
    const icons = []
    console.log(rating)
    for (let star = 1; star <= rating; star++) {
      icons.push(
      <Icon
        name = 'star'
        key={star}
        type='font-awesome'
        />
      )
    }
    if (!Number.isInteger(rating)) {
      icons.push(
        <Icon
          name = 'star-half'
          key={6}
          type='font-awesome'
          />
        )
    }
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        {icons}
        <Text> {review_count} Reviews</Text>
      </View>
    )
  }

  render() {
    const { results } = this.state;
    if (results.length === 0) {
      return (
        <Text>Loading...</Text>
      )
    }
    console.log(results)

    return (
      <ScrollView style={{ flex: 1 }}>
        {
          results.map((result, index) => {
            const title = `${index + 1}. ${result.name}`;
            console.log(result.photos)
            return (
              <Card
                title={title}
                titleStyle={styles.title}
                containerStyle={{flexDirection: 'row'}}
                key={index}>
                <Image
                  style={{width: 50, height: 50}}
                  source={{uri: result.photos[0]}}
                />
                {this.createStarIcons(result.rating, result.review_count)}
                <Text>
                  {result.location.address1}, {result.location.city}
                </Text>
                <Text style={{marginBottom: 10}}>
                  {(result.distance / 1000).toFixed(0)} km away
                </Text>
              </Card>
            );
          })
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
  }
});