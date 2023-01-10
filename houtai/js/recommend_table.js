
layui.use('table', function(){
  var table = layui.table;
  table.render({
    elem: '#test'
    ,url:'http://127.0.0.1:1010/recommend_table.php'
    ,toolbar: true
    ,title: '推荐商品表'
	  ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
	,page: {
	   limit: 10,
	   limits: [10,30,50,100,200,5000]
	  }
    ,cols: [[
	  {type:'checkbox', fixed: 'left'}
      ,{field:'id', title:'推荐ID', width:120, fixed: 'left', unresize: true, sort: true, totalRowText: '合计行'}
      ,{field:'name', title:'商品名称', width:120,}
      ,{
						field: 'image',
						title: '轮播图',
						align: 'center',
						width:120,
						templet: function dataURLtoFile(d) {
							var img = "<img src=" + '"' + "http://127.0.0.1:1010/"+d.image + '"' +
								"style='width:50px;height:50px;'/>";
							return img;
						}
					}
      ,{field:'Desc', title:'商品描述', sort: true, totalRow: true}
      ,{field:'price', title:'商品价格', width:150, sort: true}
	  ,{fixed: 'right',title:'操作', width:178, align:'center', toolbar: '#barDemo'}
    ]]
	,id: 'testReload'
    ,page: true
    ,response: {
      statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
    }
    ,parseData: function(res){ //res 即为原始返回的数据
               return {
                               "code": 200, //解析接口状态
                               "msg": res.msg, //解析提示文本
                               "count": res.length, //解析数据长度
                               "data": res //解析数据列表
                           }
            }
  });
  
   //监听头工具栏事件
    table.on('toolbar(test)', function(obj){
      var checkStatus = table.checkStatus(obj.config.id)
      ,data = checkStatus.data; //获取选中的数据
      switch(obj.event){
        case 'add':
        layer.open({
                               type: 2
                               , title: '添加商品'
                               , area: ['600px', '600px'] //宽高
                               , shadeClose: false
                               , scrollbar: false // 父页面 滚动条 禁止
                               , content:"./page/layer_window/layer_insert.html"
                               , btn: ['添加', '取消']
        						//提交操作
                               , yes: function (index, layero) {
        						  var body = layer.getChildFrame('body', index);  //巧妙的地方在这里哦
                                  var name=body.contents().find("#title").val();
                                  var image= body.contents().find("#image_link").text();
                                  var desc=body.contents().find("#desc").val();
								  var price=body.contents().find("#price").val();
								  alert(image);
                                  // var id=body.contents().find("#id").val();
								  // 发起请求
        								   $.ajax({
        								   type: "post",
        								   url: "http://127.0.0.1:1010/recommend_insert.php",
        								   data:{'id':data.id,'name':name,'image':image,'desc':desc,'price':price},
        								   dataType: "text",
        								   success: function(data)
        								   {
        								   alert("添加成功"+image);
        								   	  layer.close(index);
        									   //执行重载
        									  window.parent.location.reload();
        								   	}
        								   });
                               }
                               , btn2: function (index, layero) {
                                   //按钮【按钮二】的回调
                                   layer.close(index);
                                   //return false 开启该代码可禁止点击该按钮关闭
                               }
                               , cancel: function () {
                                   //右上角关闭回调
                                   //return false 开启该代码可禁止点击该按钮关闭
                               }
                           });
        break;
        case 'update':
          if(data.length === 0){
            layer.msg('请选择一行');
          } else if(data.length > 1){
            layer.msg('只能同时编辑一个');
          } else {
            layer.alert('编辑 [id]：'+ checkStatus.data[0].id);
          }
        break;
        case 'delete':
          if(data.length === 0){
            layer.msg('请选择一行');
          } else {
            layer.msg('删除');
          }
        break;
      };
    });
  
   //监听表格复选框选择
    table.on('checkbox(test)', function(obj){
      console.log(obj)
    });
  
  //监听工具条:行删除和修改
    table.on('tool(test)', function(obj){
      var data = obj.data;
	  shop_id=data.id; //图片上传需要
	  type = "recommend";
      if(obj.event === 'detail'){
        layer.msg('ID：'+ data.id + ' 的查看操作');
      } else if(obj.event === 'del'){
        layer.confirm('真的删除行么', function(index){
			$.ajax({
			type: "post",
			url: "http://127.0.0.1:1010/recommend_del.php",
			data:{'id':data.id},
			dataType: "text",
			success: function(data)
			{
				alert("删除成功");
				obj.del();
				  layer.close(index);
				}
			});
		
})
      } else if(obj.event === 'edit'){
        // layer.alert('编辑行：<br>'+ JSON.stringify(data))
		 layer.open({
		                        type: 2
		                        , title: '编辑商品'
		                        , area: ['600px', '600px'] //宽高
		                        , shadeClose: false
		                        , scrollbar: false // 父页面 滚动条 禁止
		                        , content:"./page/layer_window/layer_edit.html"
		                        , btn: ['提交', '取消']
								// 获取初始数据填入表单
								 ,success: function (layero, index) {
								            	//找到它的子窗口的body
								                var body = layer.getChildFrame('body', index);  //巧妙的地方在这里哦
								                //为子窗口元素赋值
								                body.contents().find("#title").val(data.name);
						body.contents().find("#image_shop").attr('src', "http://127.0.0.1:1010/"+data.image);
						body.contents().find("#desc").val(data.desc);
						body.contents().find("#price").val(data.price);
								            }
								//提交操作
		                        , yes: function (index, layero) {
									 var body = layer.getChildFrame('body', index);  //巧妙的地方在这里哦
		                           var name=body.contents().find("#title").val();
		                          var image= body.contents().find("#image_link").text();
		                           var desc=body.contents().find("#desc").val();
		                           var price=body.contents().find("#price").val();
								   $.ajax({
								   type: "post",
								   url: "http://127.0.0.1:1010/recommend_update.php",
								   data:{'id':data.id,'name':name,'image':image,'desc':desc,'price':price},
								   dataType: "text",
								   success: function(data)
								   {
								   	alert("编辑成功");
								   	obj.del();
								   	  layer.close(index);
									   //执行重载
									  window.parent.location.reload();

								   	}
								   });
		                        }
		                        , btn2: function (index, layero) {
		                            //按钮【按钮二】的回调
		                            layer.close(index);
		                            //return false 开启该代码可禁止点击该按钮关闭
		                        }
		                        , cancel: function () {
		                            //右上角关闭回调
		                            //return false 开启该代码可禁止点击该按钮关闭
		                        }
		                    });
      }
    });
	
  // 搜索
   var $ = layui.$, active = {
      reload: function(){
        var demoReload = $('#demoReload');
        
        //执行重载
        table.reload('testReload', {
          page: {
            curr: 1 //重新从第 1 页开始
          }
          ,where: {
            key: {
              id: demoReload.val()
            }
          }
        }, 'data');
      }
    };
    
    $('.demoTable .layui-btn').on('click', function(){
      var type = $(this).data('type');
      active[type] ? active[type].call(this) : '';
    });
  
});
