var yeoman = require('yeoman-generator')

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);

        //Custom code here
        console.log('From constructor');
    },

    method1: function() {
        console.log('From method1');
    },

    method2: function() {
        console.log('From method2');
    },

    createDir: function() {
        console.log('Creating Directory');
        this.mkdir('alphayo-dir');
    },

    copyFiles: function() {
        console.log('Copying files');
        this.copy('README.md', 'README.md');
        this.directory('folderOne', 'app');
    }
});
