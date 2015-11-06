'use strict';

import angular from 'angular';
import ThingStorageService from './ThingStorageService';

export default angular.module('ThingStorageModule', []).
    service('thingStorageService', ThingStorageService).name;