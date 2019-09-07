import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Search: SearchScreen,
});

export default createAppContainer(AppNavigator);