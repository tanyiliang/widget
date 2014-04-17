module.exports = function(grunt){

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                separator: ';'
            },
            dist: {
                src: [
                    'src/zepto.js',
                    'src/gmu.js',
                    'src/event.js',
                    'src/widget.js',
                    'src/iscroll-infinite.js',
                    'src/myIscroll.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '<%=concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        jshint: {
            files: ['src/myIscroll.js'],
            options: {
                globals: {
                    exports: true
                }
            }
        },
        watch: {
            files: ['<%= jsbint.files %>'],
            tasks: ['jshint']
        }
    });



    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat','uglify']);
};