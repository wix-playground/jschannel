import 'babel-polyfill';
import 'isomorphic-fetch';
import {serverFetchUtils} from 'wix-fetch-utils';
import {getTestBaseUrl} from './test-common';

serverFetchUtils(getTestBaseUrl());
