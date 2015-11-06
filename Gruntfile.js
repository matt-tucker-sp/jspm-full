'use strict';

module.exports = function (grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: { src: [
                'Gruntfile.js',
                'app/**/*.js',
                'test/**/*.js'
            ]},
            options: {
                jshintrc: '.jshintrc'
            }
        },
        
        // This calls 'jspm bundle-sfx' on the command line to build a bundle.
        // It's parameterized so we can build multiple bundles. 
        // TODO: decide if we want a 'vendors' bundle with our dependencies and then other 'app' bundles
        exec: {
            bundleSfx: {
               cmd: function(module, bundlefile) {
                   var args = '\'' + module + '\' \'' + bundlefile + '\'';
                   return 'jspm bundle-sfx ' + args;
               } 
            }  
        },

        karma: {
            options: {
                configFile: 'karma.conf.js',
                colors: false
            },
            unit: {
                browsers: ['PhantomJS']
            },
            chrome: {
                browsers: ['Chrome'],
                singleRun: false
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            all: {
                files: [
                    {
                        expand: true,
                        src: [
                            'build/js/**/*.js'
                        ]
                    }
                ]
            }
        },
        
        // Minify and whatnot our bundles for production
        uglify: {
           all: {
               files: [{
                   expand: true,     // Enable dynamic expansion.
                   cwd: 'build/js',      // Src matches are relative to this path.
                   src: ['**/*Bundle.js'], // Actual pattern(s) to match.
                   dest: 'build/js',
                   ext: '.min.js',   
                   extDot: 'first'   
               }]
           } 
        },

        // This will replace our development script tags with production ones pointing to our minified bundles
        processhtml: {
           build: {
               files: {
                   'build/index.html': ['index.html']
               } 
           } 
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-karma');
    
    // Turn off color for terminals that do not support color
    grunt.option('color', false);

    // Default task(s).
    grunt.registerTask('default', [
        'newer:jshint',
        'karma:unit',
        'exec:bundleSfx:app/ThingApp:build/js/ThingAppBundle.js',
        'ngAnnotate',
        'uglify:all',
        'processhtml:build'
    ]);

};