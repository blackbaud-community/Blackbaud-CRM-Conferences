/*jshint node: true */

/**
 * Karma configuration options shared between CI and local versions.
 * Files array is set in grunt/test so we can use grunt.config.
 */
module.exports = function (config) {
    "use strict";

    var shared = {
        //singleRun: false,
        //autoWatch: false,
        frameworks: [
            'jasmine'
        ],
        // Look into moving this grunt so skyux.paths.libsJs can be used
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-touch/angular-touch.js',
            'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/moment/moment.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'test/**/*.spec.js'
        ],
        exclude: [
            //'src/**/docs/*'
        ],
        preprocessors: {
            'src/**/*.js': [
                'coverage'
            ]
        },
        reporters: [
            'dots',
            'coverage'
        ],
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {
                    type: 'html'
                },
                {
                    type: 'json',
                    // Necessary in order to match codecov's auto-detect
                    file: 'coverage.json'
                }
            ]
        }
    };

    config.set(shared);
    config.set({
        port: 9876,
        browsers: [
            'Chrome'
        ]
    });
};

