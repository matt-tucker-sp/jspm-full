'use strict';

module.exports = function (grunt) {
    
    // Project configuration.
    /*jshint camelcase: false */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            all: {
                src: 'app/**/*',
                dest: 'build',
                expand: true
            }
        },
        
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
        
        uglify: {
            options: {
                mangle: {
                    except: ['angular']
                }
            },
           all: {
               files: [{
                   expand: true,     // Enable dynamic expansion.
                   cwd: 'build/js',      // Src matches are relative to this path.
                   src: ['templates.js', '**/*Bundle.js'], // Actual pattern(s) to match.
                   dest: 'build/js',
                   ext: '.min.js',   
                   extDot: 'first'   
               }]
           } 
        },

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