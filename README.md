# widget #
## iscroll ##
可以直接查看示例  
    iscroll1.html  
	iscroll2.html  
此插件依赖zepto-1.1.3,iscroll5,GMU的核心文件  
支持功能  
1. 无限滑动,设置的尽头距离比较大,如果不是刻意去测试,基本不会有滑动尽头的问题  
2. 节点修正,每次滚动最终都会完整的高亮中间的选中记录,会自动上移或者下移进行调整  
3. 可以动态的配置当前页面显示多少条数据,要求为基数,方便计算和定位中间的记录  
4. 需要自行组织数据内容,支持传入默认值  
5. 提供滚动前后的回调事件,能根据选择前后的值做一些事情  
6. 提供重载数据的方法,使多个滚动条件的联动成为可能,如示例2的月与日的联动  
7. css与代码相互独立,依赖于父元素的位置  

# grunt #
1. npm install -g grunt-cli  
这条命令将会把grunt命令植入到你的系统路径中，这样就允许你从任意目录来运行它(定位到任意目录运行grunt命令)。
2. npm install grunt --save-dev  
安装最新版的Grunt到你的项目中，并自动将它添加到你的项目依赖中
3. npm install [grunt-contrib-jshint、grunt-contrib-concat、grunt-contrib-uglify] --save-dev
安装插件，功能依次为文件检测、文件合并，文件压缩
4. package.json
	<pre>{
	  "name": "myIscroll",
	  "version": "0.1.0",
	  "devDependencies": {
	    "grunt": "^0.4.4",
	    "grunt-contrib-jshint": "~0.0.4",
	    "grunt-contrib-uglify": "~0.2.2",
	    "grunt-contrib-concat": "~0.3.0"
	  }
	}
	</pre>
5. Gruntfile.js
	<pre>
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
	        }
	    });
	    grunt.loadNpmTasks('grunt-contrib-uglify');
	    grunt.loadNpmTasks('grunt-contrib-jshint');
	    grunt.loadNpmTasks('grunt-contrib-concat');
	    grunt.registerTask('default', ['concat','uglify']);
	};
	</pre>

6. 执行grunt命令，生成合并压缩后的文件到dist目录；执行grunt jshint，检查js文件语法规范
	<pre>
	D:\github\iscroll>grunt
	Running "concat:dist" (concat) task
	File "dist/myIscroll.js" created.
	
	Running "uglify:build" (uglify) task
	File "dist/myIscroll.min.js" created.
	
	Done, without errors.
	
	D:\github\iscroll>grunt jshint
	Running "jshint:files" (jshint) task
	>> 1 file lint free.
	
	Done, without errors.
	</pre>

