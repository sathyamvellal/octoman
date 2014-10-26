var yeoman = require('yeoman-generator');

var OctomanBase = yeoman.generators.Base.extend({
    createProjectDirectory: function() {
        console.log('Creating project directory ...');
        this.mkdir(this.appDir);
    },

    createTemplateContext: function() {
        this.templateContext = {
            octoman: {
                deployBranch: this.deployBranch,
                githubURL: this.githubURL
            }
        }
    },

    copyItems: function() {
        console.log('Bootstrapping assemble.js and setting up file structure ...');
        for (var i in this.itemGroups) {
            var itemGroup = this.itemGroups[i];
            
            for (var j in itemGroup.files) {
                this.template(this.prefixPath(itemGroup.src, itemGroup.files[j]), this.prefixPath(itemGroup.dest, itemGroup.files[j]), this.templateContext);
            }

            for (var j in itemGroup.directories) {
                this.directory(this.prefixPath(itemGroup.src, itemGroup.directories[j]), this.prefixPath(itemGroup.dest, itemGroup.directories[j]));
            }
        }
    },

    setupGithubRepo: function() {
        console.log('Setting up github integration...');
        // this.mkdir(this.inAppDir(this.deployDirectory));
    },

    prefixPath: function(prefix, path) {
        return (prefix && prefix != '' ? prefix + '/' : '') + path;
    },

    inAppDir: function(path) {
        return this.prefixPath(this.appDir, path);
    }
});

module.exports = OctomanBase.extend({
    promptUser: function() {
        var done = this.async();

        var prompts = [{
            name: "appName",
            message: "Application Name: ",
            default: this.appname
        }, {
            name: "githubURL",
            message: "Github URL",
        }];

        this.prompt(prompts, function(answers) {
            this.appName = answers.appName;
            this.githubURL = answers.githubURL;
            this.appDir = this.appName.toLowerCase().replace(/\s/, "-");

            done();
        }.bind(this));
    },

    init: function() {
        this.assembleDir = 'assemble-init';
        this.sourceDir = this.prefixPath(this.assembleDir, 'source');
        this.deployDirectory = this.prefixPath(this.assembleDir, 'public');

        this.itemGroups = [{
            src: this.assembleDir,
            dest: this.appDir,
            files: ['README.md', 'bower.json', '.bowerrc', 'Gruntfile.js', 'package.json'],
            directories: ['source']
        }]
    },

    identifyProjectType: function() {
        var githubURLSplit = this.githubURL.split("/");
        var githubProject = githubURLSplit.pop();
        var githubUsername = githubURLSplit.pop().split(":").pop();

        this.isProjectRepo = githubProject.indexOf(githubUsername + ".github.") < 0;
        this.deployBranch = this.isProjectRepo ? 'gh-pages' : 'master';
    },

    setup: function() {
        this.createProjectDirectory();
        this.createTemplateContext();
        this.copyItems();
        this.setupGithubRepo();
    }
});
