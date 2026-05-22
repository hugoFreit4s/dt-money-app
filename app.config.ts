import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'dt-money-app',
  slug: 'dt-money-app',
  extra: {
    apiBaseUrlAndroid: 'http://10.0.2.2:3001',
    apiBaseUrlIos: 'http://localhost:3001',
  },
});
