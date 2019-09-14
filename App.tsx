import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { YELP_API_KEY } from 'react-native-dotenv';
import { ApolloProvider } from '@apollo/react-hooks';
import { API_ENDPOINT } from './api/Constants';
import ApolloClient from 'apollo-boost';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';

const client = new ApolloClient({
  uri: API_ENDPOINT,
  headers: {
    authorization: `Bearer ${YELP_API_KEY}`,
    'Accept-Language': 'en_US',
  },
});

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Search: SearchScreen,
});

const AppContainer = createAppContainer(AppNavigator);

const App = () => (
  <ApolloProvider client={client}>
    <AppContainer />
  </ApolloProvider>
)

export default App;