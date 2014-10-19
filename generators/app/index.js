var yeoman = require('yeoman-generator')

module.exports = yeoman.generators.Base.extend({
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

            done();
        }.bind(this));
    },

    identifyProjectType: function() {
        var githubURLSplit = this.githubURL.split("/");
        var githubProject = githubURLSplit.pop();
        var githubUsername = githubURLSplit.pop().split(":").pop()
        this.isProjectRepo = githubProject.indexOf(githubUsername + ".github.") < 0;
    }
});
