import React from 'react';
import { Image, Text, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Icon } from 'react-native-elements';

import { Business } from '../api/Types';

export default class ListView extends React.Component<{ results: Business[] }, {}> {
  constructor(props) {
    super(props);
  }

  renderStarIcons(rating: number, review_count: number) {
    const icons = [];
    for (let star = 1; star <= rating; star++) {
      icons.push(
        <Icon
          name="star"
          key={star}
          type="font-awesome"
        />,
      );
    }
    if (!Number.isInteger(rating)) {
      icons.push(
        <Icon
          name="star-half"
          key={6}
          type="font-awesome"
        />,
      );
    }
    return (
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {icons}
        <Text>
          {' '}
          {review_count}
          {' '}
          Reviews
        </Text>
      </View>
    );
  }

  renderResults(results) {
    const size = 50;
    return results.map((result, index) => {
      const title = `${index + 1}. ${result.name}`;
      return (
        <Card
          title={title}
          titleStyle={styles.cardTitle}
          containerStyle={{ flexDirection: 'row' }}
          key={index}
        >
          <Image
            style={{ width: size, height: size }}
            source={{ uri: result.photos[0] }}
          />
          {this.renderStarIcons(result.rating, result.review_count)}
          <Text>
            {result.location.address1}, {result.location.city}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            {(result.distance / 1000).toFixed(1)}
            {' '} km away
          </Text>
        </Card>
      );
    });
  }

  render() {
    const { results } = this.props;
    return (
      <ScrollView style={{ flex: 1 }}>
        {this.renderResults(results)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardTitle: {
    textAlign: 'left',
  },
});
