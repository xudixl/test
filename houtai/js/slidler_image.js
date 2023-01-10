layui.use('upload', function(){
	  var $ = layui.jquery
	  ,upload = layui.upload;
	  //普通图片上传
	  var uploadInst = upload.render({
	    elem: '#upload_image'
	    ,url: 'http://127.0.0.1:1010/upload_img.php' //改成您自己的上传接口
	    ,field: 'file' //字段名称
	    ,method: 'post' //提交方式
		
	    ,accept: 'images'  //上传格式
	    ,before: function(obj){
	      //预读本地文件示例，不支持ie8   
	      obj.preview(function(index, file, result){
	        $('#slider_image_link').attr('src', result); //图片链接（base64）
	      });
	    } 
	    ,done: function(res,index){
			$("#slider_link_show").text(res.data.data3);
	      //document.getElementById("test5").value = "11111";
	     // $('#test5').attr('value', res.code3); //图片地址
		 alert(res.data.data3);
		 image = res.data.data3;
		 var body = layer.getChildFrame('body', index);  //巧妙的地方在这里哦
		 var id=body.contents().find("#id").val();
	       if(res.code = "0"){
	        return layer.msg('图片上传保存成功！');
	      }
	      //如果上传失败
	      if(res.code ="1"){
	        return layer.msg('上传失败,图片已存在');
	      }
	      if(res.code ="2"){
	        return layer.msg('上传失败,非法的图片格式');
	      }
	    }
	    ,error: function(){
	      //演示失败状态，并实现重传
	      var demoText = $('#demoText');
	      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
	      demoText.find('.demo-reload').on('click', function(){
	        uploadInst.upload();
	      });
	    }
	  });
	});