import { gql } from 'apollo-boost';

export const QUERY_CATEGORIES = gql`{
  categories {
    category {
      alias
      title
    }
  }
}`;

export const QUERY_BUSINESSES_BY_TERM = gql`
  query getBusinessesBySearchTerm($term: String, $location: String, $longitude: Float, $latitude: Float) {
    search(term: $term,
      location: $location,
      longitude: $longitude,
      latitude: $latitude) {
      total
      business {
        name
        rating
        review_count
        distance
        photos
        url
        location {
          address1
          city
          state
        }
        coordinates {
          latitude
          longitude
        }
      }
    }
  }
`;

export const QUERY_BUSINESSES_BY_CATEGORY = gql`
  query getBusinessesByCategory($categories: String, $location: String, $longitude: Float, $latitude: Float) {
    search(categories: $categories,
      location: $location,
      longitude: $longitude,
      latitude: $latitude) {
      total
      business {
        name
        rating
        review_count
        distance
        photos
        url
        location {
          address1
          city
          state
        }
        coordinates {
          latitude
          longitude
        }
      }
    }
  }
`;
