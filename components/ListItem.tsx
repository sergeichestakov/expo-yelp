import React from 'react';
import {
  Text, View, Platform, StyleSheet, TouchableNativeFeedback, TouchableHighlight,
} from 'react-native';
import ApolloClient from 'apollo-boost';
import { NavigationScreenProp } from 'react-navigation';

import { COLORS } from '../api/Constants';
import { Coordinates } from '../api/Types';

export default class ListItem extends React.Component<
  { // props
    alias: string,
    title: string,
    location: string,
    coordinates: Coordinates,
    client: ApolloClient<unknown>,
    navigation: NavigationScreenProp<any, any>
  }> {
  onPress = () => {
    const {
      alias, client, title, coordinates, location,
    } = this.props;
    if (alias) {
      this.props.navigation.navigate('Search', {
        category: alias,
        categoryTitle: title,
        coordinates,
        location,
        client,
      });
    }
  };

  renderView = () => {
    const { alias, title } = this.props;
    return (
      <View>
        <Text style={alias.length > 0 ? styles.item : styles.headerText}>{title}</Text>
      </View>
    );
  };

  render() {
    return Platform.select({
      android: (
        <TouchableNativeFeedback
          onPress={this.onPress}
          background={TouchableNativeFeedback.Ripple('grey')}
        >
          {this.renderView()}
        </TouchableNativeFeedback>
      ),
      default: (
        <TouchableHighlight onPress={this.onPress} underlayColor="lightgray">
          {this.renderView()}
        </TouchableHighlight>
      ),
    });
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: COLORS.lightgrey,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
