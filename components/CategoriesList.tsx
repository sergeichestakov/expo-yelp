import React from 'react';
import { ActivityIndicator, View, Text, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import ListItem from '../components/ListItem';
import { QUERY_CATEGORIES } from '../api/Query';
import { COLORS, POPULAR_CATEGORIES } from '../api/Constants';

const CategoriesList = (props) => {
  const { error, data, loading } = useQuery(QUERY_CATEGORIES);

  if (loading) {
    return (
      <View style={{ top: 100 }}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ top: 5 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Whoops something went wrong.</Text>
        <Text>Please check your network connection and try again later.</Text>
      </View>
    )
  }

  const categories = POPULAR_CATEGORIES.concat(data.categories.category);
  const { coordinates, location, navigation } = props;
  return (
    <FlatList
      data={categories}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) =>
        <ListItem
          alias={item.alias}
          coordinates={coordinates}
          title={item.title}
          location={location}
          navigation={navigation}
        />}
      stickyHeaderIndices={[0, POPULAR_CATEGORIES.length - 1]}
    />
  )
}

export default CategoriesList;