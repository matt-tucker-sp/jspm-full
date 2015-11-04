/* */ 
module.exports = function(grunt) {
  grunt.registerTask('test', 'run jshint, qunit source w/ coverage, and validate HTML', ['jshint', 'connect:testServer', 'blanket_qunit:source', 'qunit:noMoment', 'qunit:globals', 'htmllint']);
  grunt.registerTask('validate-dist', 'run qunit:source, dist, and then qunit:full', ['connect:testServer', 'qunit:source', 'dist', 'browserify:commonjs', 'qunit:dist']);
  grunt.registerTask('releasetest', 'run jshint, build dist, all source tests, validation, and qunit on SauceLabs', ['test', 'dist', 'browserify:commonjs', 'qunit:dist', 'saucelabs-qunit:defaultBrowsers']);
  grunt.registerTask('saucelabs', 'run jshint, and qunit on saucelabs', ['connect:testServer', 'jshint', 'saucelabs-qunit:defaultBrowsers']);
  grunt.registerTask('trickysauce', 'run tests, jshint, and qunit for "tricky browsers" (IE8-11)', ['connect:testServer', 'jshint', 'saucelabs-qunit:trickyBrowsers']);
  grunt.registerTask('travisci', 'Tests to run when in Travis CI environment', ['test', 'dist', 'browserify:commonjs', 'qunit:dist']);
  grunt.registerTask('resetdist', 'resets changes to dist to keep them from being checked in', function() {
    if (typeof grunt.option('resetdist') === "undefined" || grunt.option('resetdist')) {
      var exec = require('child_process').exec;
      exec('git reset HEAD dist/*');
      exec('git checkout -- dist/*');
    }
  });
};
