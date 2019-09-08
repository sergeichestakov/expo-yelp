import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
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
      categories: POPULAR_CATEGORIES,
    };
  }

  componentWillMount() {
    this.getAllCategories();
  }

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  search = (value: string) => {
    this.setState({ search: "" })
    const { client } = this.state;
    this.props.navigation.navigate('Search', { client, value });
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
      const { search, categories } = this.state;

      return (
        <View>
          <View style={styles.searchBarView}>
            <SearchBar
              placeholder="Search for burgers, delivery, barbeque..."
              onChangeText={this.updateSearch}
              containerStyle={styles.containerStyle}
              inputStyle={styles.inputStyle}
              platform="android"
              lightTheme
              onSubmitEditing={() => this.search(search)}
              value={search}
            />
          </View>
          <FlatList
            data={categories}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => <Text style={item.alias.length > 0 ? styles.item: styles.headerText}>{item.title}</Text>}
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
  },
  inputStyle: {
    color: COLORS.grey,
    fontSize: 16,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: COLORS.lightgrey,
  },
  item: {
    padding: 10,
    fontSize: 20,
    height: 44,
  },
})