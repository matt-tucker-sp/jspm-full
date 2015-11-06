'use strict';

import angular from 'angular';
import ThingGetter from './ThingGetter/ThingGetterModule';
import ThingPutter from './ThingPutter/ThingPutterModule';

// Create ThingApp and use the ThingGetterModule
angular.module('ThingApp', [
    ThingGetter,
    ThingPutter
]);

// Bootstrap the ThingApp when the document is all ready
angular.element(document).ready(function() {
    angular.bootstrap(document, ['ThingApp']);
});




