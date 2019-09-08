import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import ApolloClient, { gql } from 'apollo-boost';
import { YELP_API_KEY } from 'react-native-dotenv'
import { NavigationScreenProp } from 'react-navigation';

import { SearchBar } from 'react-native-elements';

const POPULAR_CATEGORIES = [
  {
    "alias": "",
    "title": "Popular Categories",
  },
  {
    "alias": "restaurants",
    "title": "Restaurants"
  },
  {
    "alias": "bars",
    "title": "Bars"
  },
  {
    "alias": "nightlife",
    "title": "Nightlife"
  },
  {
    "alias": "coffee",
    "title": "Coffee & Tea"
  },
  {
    "alias": "gasstations",
    "title": "Gas Stations"
  },
  {
    "alias": "drugstores",
    "title": "Drugstores"
  },
  {
    "alias": "shopping",
    "title": "Shopping"
  },
  {
    "alias": "everything",
    "title": "Everything"
  },
  {
    "alias": "",
    "title": "All Categories",
  },
]

class ListItem extends React.Component<
  {
    alias: string,
    title: string,
    client: ApolloClient<unknown>,
    navigation: NavigationScreenProp<any,any>
  }> {
  onPress = () => {
    const { alias, client, title } = this.props;
    if (alias) {
      this.props.navigation.navigate('Search', { category: alias, client, categoryTitle: title })
    }
  };

  renderView = () => {
    const { alias, title } = this.props;
    return (
      <View>
        <Text style={alias.length > 0 ? styles.item: styles.headerText}>{title}</Text>
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

const API_ENDPOINT: string = 'https://api.yelp.com/v3/graphql';
const COLORS = {
  red: '#d32323',
  grey: '#919191',
  lightgrey: '#cccccc',
}

type Category = {
  alias: string,
  title: string,
}

export default class HomeScreen extends React.Component<
  { // props
    navigation: NavigationScreenProp<any,any>
  },
  { // state
    client: ApolloClient<unknown>,
    search: string,
    location: string | null,
    categories: Category[]
  }> {
  static navigationOptions = {
    headerStyle: {
      height: 0,
      backgroundColor: COLORS.red,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(props) {
    super(props);

    const client = new ApolloClient({
      uri: API_ENDPOINT,
      headers: {
        authorization: `Bearer ${YELP_API_KEY}`
      }
    });
    this.state = {
      client: client,
      search: '',
      location: null,
      categories: POPULAR_CATEGORIES,
    };
  }

  componentWillMount() {
    this.getAllCategories();
  }

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  updateLocation = (location: string) => {
    this.setState({ location });
  };

  search = (value: string) => {
    this.setState({ search: "", location: "" })
    const { client, location } = this.state;
    this.props.navigation.navigate('Search', { client, value, location });
  };

  getAllCategories = () => {
    const { client } = this.state;
    const query = gql`{
      categories{
        category {
          alias
          title
        }
      }
    }`

    client
    .query({ query })
    .then(results => {
      const categories = results.data.categories.category;
      
      this.setState({ categories: this.state.categories.concat(categories) });
    })
  }

  render() {
      const { search, categories, client, location } = this.state;

      return (
        <View>
          <View style={styles.searchBarView}>
            <SearchBar
              placeholder="Search for burgers, delivery, barbeque..."
              onChangeText={this.updateSearch}
              containerStyle={styles.containerStyle}
              inputContainerStyle={{borderRadius: 1, borderColor: 'blue'}}
              inputStyle={styles.inputStyle}
              platform="android"
              lightTheme
              onSubmitEditing={() => this.search(search)}
              value={search}
            />
            <SearchBar
              placeholder="Current Location"
              placeholderTextColor="blue"
              onChangeText={this.updateLocation}
              containerStyle={styles.containerStyle}
              inputStyle={styles.inputStyle}
              searchIcon={null}
              platform="android"
              lightTheme
              onSubmitEditing={() => this.search(search)}
              value={location}
            />
          </View>
          <FlatList
            data={categories}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => <ListItem alias={item.alias} client={client} title={item.title} navigation={this.props.navigation}></ListItem>}
            stickyHeaderIndices={[0, POPULAR_CATEGORIES.length - 1]}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  searchBarView: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: COLORS.red,
  },
  containerStyle: {
    height: 50,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.lightgrey
  },
  inputStyle: {
    color: 'black',
    fontSize: 16,
  },
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
})