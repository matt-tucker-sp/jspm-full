'use strict';

class ThingGetterCtrl {
    
    constructor(thingStorageService) {
        'ngInject';
        
        this.thingStorageService = thingStorageService;
    }
    
    getThatThing() {
        return this.thingStorageService.getTheThing();
    }
}

export default ThingGetterCtrl;