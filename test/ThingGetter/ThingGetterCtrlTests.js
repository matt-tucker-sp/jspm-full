import ThingGetterCtrl from 'app/ThingGetter/ThingGetterCtrl';
import ThingStorageService from 'app/ThingStorage/ThingStorageService';

let thingStorageService;
let thingGetterCtrl;

describe('ThingGetterCtrl', function() {

    beforeEach(function() {
        thingStorageService = new ThingStorageService();
        thingGetterCtrl = new ThingGetterCtrl(thingStorageService);
    });

    describe('getThatThing', function( ) {
        it ('returns the thing', function() {
            expect(thingGetterCtrl.getThatThing()).toEqual(thingStorageService.getTheThing());
        });
    });

});