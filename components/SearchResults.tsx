import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import Map from './Map';
import ListView from './ListView';
import { COLORS, DEFAULT_DELTA } from '../api/Constants';
import { QUERY_BUSINESSES_BY_TERM, QUERY_BUSINESSES_BY_CATEGORY } from '../api/Query';

const getRegion = (business) => {
  const { coordinates } = business;
  const { latitude, longitude } = coordinates;
  return {
    latitude,
    longitude,
    ...DEFAULT_DELTA
  };
}

const SearchResults = (props) => {
  const { categories, term, longitude, latitude, showMapView, location } = props;

  const query = categories === null ? QUERY_BUSINESSES_BY_TERM : QUERY_BUSINESSES_BY_CATEGORY;
  const search = categories === null ? { term } : { categories };
  const variables = location.length ? { // Use user inputted location
    ...search,
    location,
  } : { // Use current lat/lng
    ...search,
    longitude,
    latitude,
  };

  const { loading, data, error } = useQuery(query, { variables });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ top: 5 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Whoops something went wrong.</Text>
        <Text>Please check your network connection and try again later.</Text>
      </View>
    )
  }

  const currentLocation = {
    latitude,
    longitude,
    ...DEFAULT_DELTA
  };
  const businesses = data.search.business;
  const region = location.length ? getRegion(businesses[0]) : currentLocation;

  return showMapView
    ? <Map region={region} results={businesses} />
    : <ListView results={businesses} />;
}

export default SearchResults;