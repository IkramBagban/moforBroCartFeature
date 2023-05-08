import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl:
      Platform.OS == 'web'
        ? 'http://localhost:3000'
        : 'http://192.168.26.183:3000',
  }),

  // root tag types
  tagTypes: ['Products'],

  endpoints: (builder) => ({
    getProducts: builder.query({
      // the URL for the request is '/products'
      query: () => '/products',
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery } = apiSlice;
