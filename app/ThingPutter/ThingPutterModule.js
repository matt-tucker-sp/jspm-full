'use strict';

import angular from 'angular';
import 'angular-bootstrap';
import ThingStorageModule from '../ThingStorage/ThingStorageModule';
import ThingPutterDirective from './ThingPutterDirective';


export default angular.module('ThingPutter', [ 'ui.bootstrap', ThingStorageModule ]).
    directive('spThingPutter', ThingPutterDirective)
    .name;