'use strict';

class ThingPutterDirectiveCtrl {
    
    constructor(thingStorageService) {
        'ngInject';
        
        this.thingStorageService = thingStorageService;
        this.count = 0;
    }
    
    storeThing(newThing) {
        this.thingStorageService.setTheThing(newThing);
    }
    
    getCurrentThing() {
        return this.thingStorageService.getTheThing();
    }
    
    increment() {
        this.count ++;
    }
    
    getCount() {
        return this.count;
    }
}

export default ThingPutterDirectiveCtrl;