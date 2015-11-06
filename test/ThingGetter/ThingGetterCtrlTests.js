import ThingGetterCtrl from 'app/ThingGetter/ThingGetterCtrl';

let thingStorageService, thingGetterCtrl, thingValue;

describe('ThingGetterCtrl', function() {

    beforeEach(function() {
        thingStorageService = {
            getTheThing: jasmine.createSpy().and.callFake(function() {
                return thingValue;
            })
        };
        thingGetterCtrl = new ThingGetterCtrl(thingStorageService);
    });

    describe('getThatThing', function( ) {
        it ('returns the thing', function() {
            thingValue = 'some dumb value';
            let gotValue = thingGetterCtrl.getThatThing();
            expect(thingStorageService.getTheThing).toHaveBeenCalled();
            expect(gotValue).toEqual(thingValue);
        });
    });

});