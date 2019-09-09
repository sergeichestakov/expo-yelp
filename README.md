# Expo Yelp Client

Minimal Yelp Client which leverages the Yelp GraphQL API.

## Features
- Search for businesses based on a term or category
- View points of interest as a list or on a map
- See rating, number of reviews, address, and distance from current location for each business
- Search in a specific location (e.g. San Francisco) or based on the device's location

## How to Run
1. Clone repo and install dependencies
```bash
git clone https://github.com/sergeichestakov/expo-yelp.git
cd expo-yelp
yarn
```

2. Configure API Key

Make sure you get an API Key from Yelp's [Developer Page](https://www.yelp.com/developers/v3/manage_app)
and opt in to the Developer Beta (this is needed to use the GraphQL API).

Then, put that API key into a file called `.env` in the project's root directory with the following format:
```bash
YELP_API_KEY=${YOUR_KEY_HERE}
```

3. Start the app and open it in the Expo Client
```bash
expo start
```

Or try the published version [here](https://expo.io/@sergeichestakov/expo-yelp)