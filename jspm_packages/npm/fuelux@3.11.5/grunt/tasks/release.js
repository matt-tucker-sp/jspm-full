/* */ 
module.exports = function(grunt) {
  var packageVersion = require('../../package.json!systemjs-json').version;
  grunt.registerTask('notes', 'Run a ruby gem that will request from Github unreleased pull requests', ['prompt:generatelogsmanually']);
  grunt.registerTask('updateRelease', '', function() {
    packageVersion = require('../../package.json!systemjs-json').version;
  });
  grunt.registerTask('release', 'Release a new version, push it and publish it', function() {
    var releaseDefaults = {release: {
        files: ['dist', 'README.md', 'DETAILS.md', 'bower.json', 'package.json'],
        localBranch: 'release',
        remoteBaseBranch: 'master',
        remoteDestinationBranch: '3.x',
        remoteRepository: 'upstream'
      }};
    grunt.config.merge(releaseDefaults);
    if (typeof grunt.config('sauceLoginFile') === 'undefined') {
      grunt.log.write('The file SAUCE_API_KEY.yml is needed in order to run tests in SauceLabs.'.red.bold + ' Please contact another maintainer to obtain this file.');
    }
    if (typeof grunt.config('cdnLoginFile') === 'undefined') {
      grunt.log.write('The file FUEL_CDN.yml is needed in order to upload the release files to the CDN.'.red.bold + ' Please contact another maintainer to obtain this file.');
    }
    grunt.task.run(['prompt:createmilestone', 'prompt:bumpmilestones', 'prompt:closemilestone', 'prompt:startrelease', 'prompt:tempbranch', 'shell:checkoutRemoteReleaseBranch', 'updateRelease', 'prompt:build', 'dorelease']);
  });
  grunt.registerTask('dorelease', '', function() {
    grunt.log.writeln('');
    if (!grunt.option('no-tests')) {
      grunt.task.run(['releasetest']);
      grunt.task.run('clean:screenshots');
    }
    grunt.config('banner', '<%= bannerRelease %>');
    grunt.task.run(['bump-only:' + grunt.config('release.buildSemVerType'), 'replace:readme', 'replace:packageJs', 'dist', 'shell:addReleaseFiles', 'prompt:commit', 'prompt:tag', 'prompt:pushLocalBranchToUpstream', 'prompt:pushTagToUpstream', 'prompt:uploadToCDN', 'prompt:pushLocalBranchToUpstreamMaster', 'shell:publishToNPM', 'prompt:generatelogs']);
  });
};
