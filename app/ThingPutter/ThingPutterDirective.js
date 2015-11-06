'use strict';

import ThingPutterDirectiveCtrl from './ThingPutterDirectiveCtrl';
import template from './template/thing-putter.html!text';

export default function() {
    return {
        restrict: 'A',
        scope: {
            initialCount: '='
        },
        controller: ThingPutterDirectiveCtrl,
        controllerAs: 'putterCtrl',
        bindToController: true,
        template: template
    };
}