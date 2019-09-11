export const API_ENDPOINT: string = 'https://api.yelp.com/v3/graphql';

export const COLORS = {
  red: '#d32323',
  grey: '#919191',
  lightgrey: '#cccccc',
  white: '#fff',
};

export const DEFAULT_DELTA = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const POPULAR_CATEGORIES = [
  {
    alias: '',
    title: 'Popular Categories',
  },
  {
    alias: 'restaurants',
    title: 'Restaurants',
  },
  {
    alias: 'bars',
    title: 'Bars',
  },
  {
    alias: 'nightlife',
    title: 'Nightlife',
  },
  {
    alias: 'coffee',
    title: 'Coffee & Tea',
  },
  {
    alias: 'gasstations',
    title: 'Gas Stations',
  },
  {
    alias: 'drugstores',
    title: 'Drugstores',
  },
  {
    alias: 'shopping',
    title: 'Shopping',
  },
  {
    alias: 'everything',
    title: 'Everything',
  },
  {
    alias: '',
    title: 'All Categories',
  },
];
