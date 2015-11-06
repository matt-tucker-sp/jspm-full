angular.module('ThingApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ThingPutter/template/thing-putter.html',
    "<div>\n" +
    "  <button ng-click=\"putterCtrl.increment()\">\n" +
    "    Increment  \n" +
    "  </button>\n" +
    "</div>\n" +
    "<div> Count {{ putterCtrl.getCount() }} </div>\n" +
    "<div>\n" +
    "  <input id=\"putThingHere\" type=\"text\" ng-model=\"putterCtrl.enteredThing\" />\n" +
    "  <label for=\"putThingHere\">PUT THING HERE</label>\n" +
    "  <button ng-click=\"putterCtrl.storeThing(putterCtrl.enteredThing)\" > PUT IT</button>\n" +
    "  \n" +
    "</div>"
  );

}]);
