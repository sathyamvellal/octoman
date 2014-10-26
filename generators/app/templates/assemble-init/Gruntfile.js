'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            src: 'source',
            dist: 'public',

            assetsdir: '<%%= config.src %>/assets',
            templatesdir: '<%%= config.src %>/templates',
            datadir: '<%%= config.src %>/data',
            pagesdir: '<%%= config.src %>/pages',
            postsdir: '<%%= config.src %>/posts',
            componentsdir: '<%%= config.src %>/components',
            lessdir: '<%%= config.assetsdir %>/less',
            layoutsdir: '<%%= config.templatesdir %>/layouts',
            partialsdir: '<%%= config.templatesdir %>/partials',

            layouts: '<%%= config.layoutsdir %>/**/*.hbs',
            partials: '<%%= config.partialsdir %>/**/*.hbs',
            data: '<%%= config.datadir %>/*.{json,yml}',
            pages: '<%%= config.pagesdir %>/**/*.hbs',
            posts: '<%%= config.postsdir %>/**/*.hbs',
            assets: '<%%= config.assetsdir %>/**',
            less: '<%%= config.lessdir %>/**/*.less',
            templates: '<%%= config.templatesdir %>/**'
        },
        assemble: {
            options: {
                flatten: true,
                assets: '<%%= config.assetsdir %>',
                layoutdir: '<%%= config.layoutsdir %>',
                data: '<%%= config.data %>',
                partials: '<%%= config.partials %>',
                marked: {
                    breaks: false,
                    gfm: true,
                    langPrefix: 'language-',
                    pedantic: false,
                    sanitize: false,
                    silent: false,
                    smartLists: false,
                    smartypants: false,
                    tables: true
                }
            },
            pages: {
                options: {
                    flatten: true,
                    assets: '<%%= config.dist %>/assets'
                },
                files: [{
                    expand: true,
                    cwd: '<%%= config.pagesdir %>',
                    src: '**/*.hbs',
                    dest: '<%%= config.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%%= config.postsdir %>',
                    src: '**/*.hbs',
                    dest: '<%%= config.dist %>/blog/'
                }]
            }
        },
        less: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%%= config.lessdir %>/',
                    src: ['*.less'],
                    dest: '<%%= config.dist  %>/assets/css/',
                    ext: '.css'
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%%= config.assetsdir %>',
                    src: ['**', '!less/**'],
                    dest: '<%%= config.dist %>/assets/'
                }]
            }
        },
        clean: ['<%%= config.dist %>/**/*'],
        watch: {
            pages: {
                files: ['<%%= config.layouts %>', '<%%= config.partials %>', '<%%= config.data %>', '<%%= config.pages %>', '<%%= config.posts %>'],
                tasks: ['newer:assemble']
            },
            assets: {
                files: ['<%%= config.assets %>', '!<%%= config.lessdir %>'],
                tasks: ['newer:copy']
            },
            styles: {
                files: '<%%= config.less %>',
                tasks: ['less']
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: '<%%= config.componentsdir %>'
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '<%%= config.dist %>'
                }
            }
        },
        'gh-pages': {
            options: {
                base: '<%%= config.dist %>',
                branch: '<%= octoman.deployBranch %>',
                repo: '<%= octoman.githubURL %>'
            },
            src: ['**']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('assemble');

    grunt.registerTask('init', ['bower:install']);
    grunt.registerTask('generate', ['assemble', 'less', 'copy']);
    grunt.registerTask('build', ['clean', 'generate']);
    grunt.registerTask('deploy', ['gh-pages']);
    grunt.registerTask('default', ['build', 'connect', 'watch']);
};
