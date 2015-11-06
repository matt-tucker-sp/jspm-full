'use strict';

import angular from 'angular';

// Import modules used for array syntax
import ThingStorageModule from '../ThingStorage/ThingStorageModule';

// Import pieces to include in this module
import ThingGetterCtrl from './ThingGetterCtrl'; 

export default angular.module('ThingGetter', [
    ThingStorageModule
]).controller('ThingGetterCtrl', ThingGetterCtrl)
.name;