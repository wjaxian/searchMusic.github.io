window.onload=function(){
	if(window.navigator.onLine==true){
		var imgurl = [];//存放歌手图片
		var gname = [];//存放歌曲名称
		var name = [];//存放歌手名字
		var url = [];//存放歌曲地址
		var onoff=0;//播放器控制开关
		var index = 0;//以上四大数据索引
		var audio = null;//音乐播放对象
		audio = document.createElement('audio');//创建一个共用的播放器
		var allTime =0;//歌曲总时间
	  	var timer = 0;//控制时间进度定时器开关
	  	$('.tishi').css({'display':'none'});

		//音乐初始化
		(function(){
			name.splice(0,name.length);
			gname.splice(0,gname.length);
			imgurl.splice(0,imgurl.length);
			url.splice(0,url.length);
			$.ajax({
				"url":"http://s.music.163.com/search/get/",
				"dataType":"jsonp",
				"data":{
					"type":1,
					"s":'她说',
					"limit":1
				},
				"jsonp":"callback",
				"cache":false,
				"success":function(data){
						$('.img').css({background:'url(../images/imgload.jpg)no-repeat',backgroundSize:'100%'});
						imgurl.push(data.result.songs[0].album.picUrl);
						url.push(data.result.songs[0].audio);
						gname.push(data.result.songs[0].name);
						name.push(data.result.songs[0].artists[0].name);
						$('ul').append('<li><i>'+gname[0]+'</i><i>'+name[0]+'</i></li>');
						$('ol').append('<li><i>'+gname[0]+'</i><i>'+name[0]+'</i></li>');
						$('.name').html('<b>'+gname[0]+'</b> - <i>'+name[0]+'</i>');
						$('.img').css({background:'url('+imgurl[0]+')',backgroundSize:'100%'});
						$('.box ul li').click(listEv);
						$('ol li').click(listEv);
						audio.src=url[0];
						audio.play();
						$('.navbar i').eq(1).html('&#xe633;');
						$('.tishi').css({'display':'none'});
						$('.allnum').html('以为您找到：'+gname.length+' 首歌曲');
					//监听，歌曲是否加载完毕，如加载完毕就执行事件
					audio.oncanplaythrough=getMusicTime;
				}
			});
		})();

		//播放器左右收缩
		$('.bar').click(function(ev){
			if($('.music').offset().left==0){
				$('.music').animate({left:'-380px'},300);
			}else{
				$('.music').animate({left:'0px'},300);
			};
			if($('.list').height()=='450'){
				$('.list').animate({height:0},10);
			};
			ev.stopPropagation();
		});

		$('span').click(searchEv);//点击收缩按钮搜索歌曲

		//输入完毕后回车搜索
		$('input').keydown(function(ev){
			var ev = ev||window.event;
			if(ev.keyCode=='13'){
				searchEv(ev);
			};
		});

		//点击网页空白隐藏搜索下拉列表
		$('html').click(function(ev){
			$('ul').html('').css({display:'none'});
			$('.list').animate({'height':0}, 300);
			ev.stopPropagation();
		});

		//点击播放器列表展示与收缩
		$('.navbar i').eq(3).click(function(ev){
			if($('.list').height()==0){
				$('.list').animate({height:'450px'},300);
			}else{
				$('.list').animate({height:'0'},300);
			};
			ev.stopPropagation();
		});

		//程序核心，搜索事件，触发后跨域请求网易音乐服务器
		function searchEv(ev){
			var vals = $('.box input').val();
			name.splice(0,name.length);
			gname.splice(0,gname.length);
			imgurl.splice(0,imgurl.length);
			url.splice(0,url.length);
			$.ajax({
				"url":"http://s.music.163.com/search/get/",
				"dataType":"jsonp",
				"data":{
					"type":1,
					"s":vals,
					"limit":15
				},
				"jsonp":"callback",
				"cache":false,
				"success":function(data){
					var val = '';
					if($('input').val()==''){
						$('.tishi').html('提示：伙计,你懒得连字都不想打，让我怎么工作？').css({'display':"block"});
						return false;
					}else{
						$('.tishi').css({'display':'none'});
							$('.tishi').css({'display':'none'});
							if(data.result.songs.length==0){
								$('.tishi').html('提示：啊哦！貌似在曲库中好像没有找到您搜索的歌曲，请您换一个关键词试试。').css({'display':"block"});
								return false;
							}else{
								$('.tishi').css({'display':'none'});
								for(var i=0;i<data.result.songs.length;i++){
									imgurl.push(data.result.songs[i].album.picUrl);
									url.push(data.result.songs[i].audio);
									gname.push(data.result.songs[i].name);
									name.push(data.result.songs[i].artists[0].name);
									if(gname[index]==undefined){
										$('.name').html('加载中..');
										return false;
									}else{
										val += '<li><i>'+gname[i]+'</i><i>'+name[i]+'</i></li>';
										$('.allnum').html('以为您找到：'+i+' 首歌曲');
									};
								};
								$('ul').html(val).css({display:'block'});
								$('ol').html(val);
								$('.box ul li').click(listEv);
								$('ol li').click(listEv);
							};
					};

				}
			});
			ev.stopPropagation();
		};


		$('.navbar i').eq(1).click(function(){
			if(onoff){
				$(this).html('&#xe633;');
				audio.play();
				onoff=0;
			}else{
				$(this).html('&#xe710;');
				audio.pause();
				onoff=1;
			};
		});

		//上一曲
		$('.navbar i').eq(0).click(function(){
			if(gname[index]==undefined){
				$('.name').html('加载中..');
				return false;
			}else{
				$('.img').css({'background':'url(../images/imgload.jpg)no-repeat','backgroundSize':'100%'});
				index--;
				if(index<0){index=gname.length-1};
				$('.name').html('<b>'+gname[index]+'</b> - <i>'+name[index]+'</i>');
				$('.img').css({background:'url('+imgurl[index]+')',backgroundSize:'100%'});
				$('.navbar i').eq(1).html('&#xe633;');
				$('.navbar-jindu .z-time').html('00:00');
				$('.navbar-jindu .x-time').html('00:00');
				$('.bar-box span').css("width",'0%');

				audio.src=url[index];
				audio.play();

				//监听，歌曲是否加载完毕，如加载完毕就执行事件
				audio.oncanplaythrough=getMusicTime;
			};
		});


		//下一曲
		$('.navbar i').eq(2).click(next);

		//监听歌曲是否播放完毕，播放完毕后触发事件
		audio.onended=function(){
			$('.navbar i').eq(1).html('&#xe710;');
		 	 next();
			clearInterval(timer);
			$('.navbar-jindu .z-time').html('00:00');
			$('.navbar-jindu .x-time').html('00:00');
			$('.bar-box span').css("width",'0%');

			timer = setInterval(function(){
				$('.bar-box span').css("width",(audio.currentTime/audio.duration)*100+'%');
				$('.navbar-jindu .x-time').html(formatTime(audio.currentTime));
			},1000);
		};

		function next(){
			if(gname[index]==undefined){
				$('.name').html('加载中..');
				return false;
			}else{
				$('.img').css({background:'url(../images/imgload.jpg)no-repeat',backgroundSize:'100%'});
				index++;
				if(index>gname.length-1){index=0};
				$('.name').html('<b>'+gname[index]+'</b> - <i>'+name[index]+'</i>');
				$('.img').css({background:'url('+imgurl[index]+')',backgroundSize:'100%'});
				$('.navbar i').eq(1).html('&#xe633;');
				$('.navbar-jindu .z-time').html('00:00');
				$('.navbar-jindu .x-time').html('00:00');
				$('.bar-box span').css("width",'0%');

				audio.src=url[index];
				audio.play();
				//监听，歌曲是否加载完毕，如加载完毕就执行事件
				audio.oncanplaythrough=getMusicTime;
			};
		};

		//列表点击播放事件函数
		function listEv(ev){
			$('.img').css({background:'url(../images/imgload.jpg)no-repeat',backgroundSize:'100%'});
			index = $(this).index();
			$('.name').html('<b>'+gname[index]+'</b> - <i>'+name[index]+'</i>');
			$('.img').css({background:'url('+imgurl[index]+')',backgroundSize:'100%'});
			$('.navbar-jindu .z-time').html('00:00');
			$('.navbar-jindu .x-time').html('00:00');
			$('.bar-box span').css("width",'0%');

			audio.src=url[index];
			audio.play();
			onoff=1;
			$('.navbar i').eq(1).html('&#xe633;');

			//监听，歌曲是否加载完毕，如加载完毕就执行事件
			audio.oncanplaythrough=getMusicTime;
		};

		//封装获取歌曲的总时长与时间进度方法
		function getMusicTime(){
			allTime = formatTime(this.duration);//歌曲的总时间
			$('.navbar-jindu .z-time').html(allTime);
			clearInterval(timer);
			timer = setInterval(function(){
				//时间进度条
				$('.bar-box span').css("width",(audio.currentTime/audio.duration)*100+'%');

				//当前时间
				$('.navbar-jindu .x-time').html(formatTime(audio.currentTime));
			},1000);
		};

		//封装格式化时间方法
		function formatTime(num){//格式化时间
			num = parseInt(num);
			var iM = Math.floor(num%3600/60);
			var iS = Math.floor(num%60);
			return toZero(iM)+':'+toZero(iS);
		};

		//封装时间补零方法
		function toZero(num){//补零操作
			if(num<10){
				return '0'+num;
			}else{
				return ''+num;
			};
		};
	}else{
		$('.tishi').html('提示：亲，您网络好像出现了异常，请检查一下网络状态，然后再试一试！').css({'display':"block"});
		return false;
	};
};
console.log('本程序由吴佳编写，程序员QQ：523453335');
