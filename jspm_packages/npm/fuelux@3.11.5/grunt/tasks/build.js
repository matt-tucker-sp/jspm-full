/* */ 
module.exports = function(grunt) {
  var commonJSBundledReferenceModule = require('../other/commonjs-reference-module');
  grunt.registerTask('distjs', 'concat, uglify', ['concat', 'uglify', 'jsbeautifier']);
  grunt.registerTask('distcss', 'Compile LESS into CSS', ['less:dist', 'less:minify', 'usebanner']);
  grunt.registerTask('distcssdev', 'Compile LESS into the dev CSS', ['less:dev']);
  grunt.registerTask('distzip', 'Compress and zip "dist"', ['copy:zipsrc', 'compress', 'clean:zipsrc']);
  grunt.registerTask('commonjs', 'Create CommonJS "bundled reference" module in `dist`', function() {
    var files = grunt.config.get('concat.fuelux.src');
    var bundledReferenceFile = 'dist/js/npm.js';
    commonJSBundledReferenceModule(grunt, files, bundledReferenceFile);
  });
  grunt.registerTask('dist', 'Build "dist." Contributors: do not commit "dist."', ['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'commonjs', 'distzip']);
};
