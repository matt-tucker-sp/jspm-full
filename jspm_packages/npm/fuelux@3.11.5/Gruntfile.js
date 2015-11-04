/* */ 
(function(process) {
  module.exports = function(grunt) {
    'use strict';
    function getPackage() {
      return grunt.file.readJSON('./package.json');
    }
    var isLivereloadEnabled = (typeof grunt.option('livereload') !== 'undefined') ? grunt.option('livereload') : true;
    var semver = require('semver');
    var packageVersion = getPackage().version;
    var fs = require('fs');
    var path = require('path');
    var commonJSBundledReferenceModule = require('./grunt/other/commonjs-reference-module');
    var connectTestServerOptionsPort = 9000;
    require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), 'grunt/config'),
      loadGruntTasks: {
        pattern: 'grunt-*',
        config: require('./package.json!systemjs-json'),
        scope: 'devDependencies'
      },
      data: {
        bannerRelease: '/*!\n' + ' * Fuel UX v<%= pkg.version %> \n' + ' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' + ' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' + ' */\n',
        banner: '/*!\n' + ' * Fuel UX EDGE - Built <%= grunt.template.today("yyyy/mm/dd, h:MM:ss TT") %> \n' + ' * Previous release: v<%= pkg.version %> \n' + ' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' + ' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' + ' */\n',
        jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Fuel UX\\\'s JavaScript requires jQuery\') }\n\n',
        bootstrapCheck: 'if (typeof jQuery.fn.dropdown === \'undefined\' || typeof jQuery.fn.collapse === \'undefined\') ' + '{ throw new Error(\'Fuel UX\\\'s JavaScript requires Bootstrap\') }\n\n',
        pkg: getPackage(),
        sauceLoginFile: grunt.file.exists('SAUCE_API_KEY.yml') ? grunt.file.readYAML('SAUCE_API_KEY.yml') : undefined,
        cdnLoginFile: grunt.file.exists('FUEL_CDN.yml') ? grunt.file.readYAML('FUEL_CDN.yml') : undefined,
        sauceUser: process.env.SAUCE_USERNAME || 'fuelux',
        sauceKey: process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : '<%= sauceLoginFile.key %>',
        allTestUrls: ['2.1.0', '1.11.0', '1.9.1', 'browserGlobals', 'noMoment', 'codeCoverage'].map(function(type) {
          if (type === 'browserGlobals') {
            return 'http://localhost:' + connectTestServerOptionsPort + '/test/browser-globals.html';
          } else if (type === 'codeCoverage') {
            return 'http://localhost:' + connectTestServerOptionsPort + '/test/?coverage=true';
          } else if (type === 'noMoment') {
            return 'http://localhost:' + connectTestServerOptionsPort + '/test/?no-moment=true';
          } else {
            return 'http://localhost:' + connectTestServerOptionsPort + '/test/?testdist=true';
          }
        }),
        connectTestServerOptionsPort: connectTestServerOptionsPort
      }
    });
    grunt.registerTask('default', 'Run source file tests. Pass --no-resetdist to keep "dist" changes from being wiped out', ['test', 'clean:screenshots', 'resetdist']);
    grunt.loadTasks('./grunt/tasks');
  };
})(require('process'));
