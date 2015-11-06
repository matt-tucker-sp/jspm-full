'use strict';

class ThingStorageService {

    constructor() {
        'ngInject';
        this.theThing = 'default thing';
    }
    
    getTheThing() {
        return this.theThing;
    }
    
    setTheThing(newThing) {
        this.theThing = newThing;
    }
}

export default ThingStorageService;