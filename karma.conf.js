module.exports = function(config) {
    return config.set({
        basePath: "",
        frameworks: ["jasmine", "browserify"],
        files: ["test/spec/**/*Spec.js"],
        exclude: [],
        preprocessors: {
            "test/spec/**/*.js": ["browserify"]
        },
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: false,
        browsers: ["PhantomJS"],
        singleRun: true
    });
};
