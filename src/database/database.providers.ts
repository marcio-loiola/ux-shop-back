import { dataSource } from '../config/data-source.config';

export const databaseProviders = [
  {
    provide: 'DataSource',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
