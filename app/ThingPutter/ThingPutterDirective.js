'use strict';

import ThingPutterDirectiveCtrl from './ThingPutterDirectiveCtrl';

// We added the text plugin for jspm, so the contents of the template file will all be loaded to 'template'
import template from './template/thing-putter.html!text';

let ThingPutterDirective = function() {
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
};

// Nice to always put export as last statement, I think
export default ThingPutterDirective;