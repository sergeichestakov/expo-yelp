import React from 'react';
import { StyleSheet, Platform, Text, View, Button } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import SearchResults from '../components/SearchResults';
import { COLORS } from '../api/Constants';
import { Coordinates, ViewType } from '../api/Types';

export default class SearchScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any, any>
  },
  { // state
    showMapView: boolean,
  }> {
  static navigationOptions = ({ navigation }) => {
    const title = `Searching for ${navigation.getParam('value') || navigation.getParam('categoryTitle')}`;
    return {
      headerTitle: <Text style={styles.headerTitle}>{title}</Text>,
      headerStyle: {
        backgroundColor: COLORS.red,
        color: COLORS.white,
      },
      headerTintColor: '#fff',

      headerRight: (
        <View style={{ paddingRight: 10 }}>
          <Button
            onPress={navigation.getParam('switchView')}
            title={navigation.getParam('buttonTitle', ViewType.MAP)}
            color={Platform.OS === 'android' ? COLORS.red : COLORS.white}
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      showMapView: false,
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      switchView: this.switchView,
      buttonTitle: ViewType.MAP
    });
  }

  switchView = () => {
    const { showMapView } = this.state;
    const { navigation } = this.props;

    const prevTitle = navigation.getParam('buttonTitle');
    navigation.setParams({
      buttonTitle: prevTitle === ViewType.MAP
        ? ViewType.LIST
        : ViewType.MAP,
    });
    this.setState({ showMapView: !showMapView });
  }

  render() {
    const { navigation } = this.props;
    const { longitude, latitude } : Coordinates = navigation.getParam('coordinates');
    const location: string = navigation.getParam('location', '');

    return (
      <SearchResults
        categories={navigation.getParam('category', null)}
        term={navigation.getParam('value')}
        location={location}
        longitude={longitude}
        latitude={latitude}
        showMapView={this.state.showMapView} />
    )
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
  },
});
