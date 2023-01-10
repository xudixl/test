layui.use('table', function() {
	var table = layui.table;
	table.render({
		elem: '#categoryTable',
		url: 'http://127.0.0.1:1010/api/category/category_search.php',
		toolbar: true,
		title: '推荐商品表',
		toolbar: 'default', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档,
		page: {
			limit: 10,
			limits: [10, 30, 50, 100, 200, 5000]
		},
		cols: [
			[{
				type: 'checkbox',
				fixed: 'left'
			}, {
				field: 'category_id',
				title: '商品ID',
				width: 120,
				fixed: 'left',
				unresize: true,
				sort: true,
				totalRowText: '合计行'
			}, {
				field: 'name',
				title: '商品名称',
				width: 120,
			}, {
				field: 'Desc',
				title: '商品介绍',
				width: 120,
			}, {
						field: 'image',
						title: '轮播图',
						align: 'center',
						templet: function dataURLtoFile(d) {
							var img = "<img src=" + '"' + "http://127.0.0.1:1010/"+d.image + '"' +
								"style='width:50px;height:50px;'/>";
							return img;
						}
					}, {
				field: 'price',
				title: '价格',
				width: 150,
				sort: true,
				totalRow: true
			}, {
				field: 'type',
				title: '商品类型',
				width: 150,
				sort: true
			}, {
				field: 'products',
				title: '所属的产品',
				width: 120,
			}, {
				field: 'variety',
				title: '所属品种',
			}, {
				field: 'area',
				title: '商品来源',
				width: 150,
				sort: true,
				totalRow: true
			}, {
				fixed: 'right',
				title: '操作',
				width: 178,
				align: 'center',
				toolbar: '#barDemo'
			}]
		],
		id: 'category_table',
		page: true,
		response: {
			statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
		},
		parseData: function(res) { //res 即为原始返回的数据
			return {
				"code": 200, //解析接口状态
				"msg": res.msg, //解析提示文本
				"count": res.length, //解析数据长度
				"data": res //解析数据列表
			}
		}
	});

	//监听头工具栏事件
	table.on('toolbar(categoryTable)', function(obj) {
		var checkStatus = table.checkStatus(obj.config.id),
			data = checkStatus.data; //获取选中的数据
		switch (obj.event) {
			case 'add':
				layer.open({
					type: 2,
					title: '添加用户',
					area: ['600px', '600px'] //宽高
					,shadeClose: false,
					scrollbar: false // 父页面 滚动条 禁止	
					,content: "../layer_window/user_insert.html",
					btn: ['添加', '取消']
						//提交操作
					,yes: function(index, layero) {
						var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
						var name = body.contents().find("#name").val();
						var image = body.contents().find("#image_link").text();
						var nickName = body.contents().find("#nickName").val();
						var phone = body.contents().find("#phone").val();
						var sex = body.contents().find("#sex").val();
						var password = body.contents().find("#password").val();
						alert(image);
						// var id=body.contents().find("#id").val();
						// 发起请求
						$.ajax({
							type: "post",
							url: "http://127.0.0.1:1010/api/user/user_insert.php",
							data: {
								'name': name,
								'image': image,
								"nickName":nickName,
								'password': password,
								'sex': sex,
								"phone":phone,
							},
							dataType: "text",
							success: function(data) {
								alert("添加成功" + image);
								layer.close(index);
								//执行重载
								window.parent.location.reload();
							}
						});
					},
					btn2: function(index, layero) {
						//按钮【按钮二】的回调
						layer.close(index);
						//return false 开启该代码可禁止点击该按钮关闭
					},
					cancel: function() {
						//右上角关闭回调
						//return false 开启该代码可禁止点击该按钮关闭
					}
				});
				break;
			case 'update':
				if (data.length === 0) {
					layer.msg('请选择一行');
				} else if (data.length > 1) {
					layer.msg('只能同时编辑一个');
				} else {
					layer.alert('编辑 [id]：' + checkStatus.data[0].id);
				}
				break;
			case 'delete':
				if (data.length === 0) {
					layer.msg('请选择一行');
				} else {
					layer.msg('删除');
				}
				break;
		};
	});

	//监听表格复选框选择
	table.on('checkbox(categoryTable)', function(obj) {
		console.log(obj)
	});

	//监听工具条:行删除和修改
	table.on('tool(categoryTable)', function(obj) {
		var data = obj.data;
		shop_id = data.id; //图片上传需要
		type = "recommend";
		if (obj.event === 'detail') {
			layer.msg('ID：' + data.id + ' 的查看操作');
		} else if (obj.event === 'del') {
			layer.confirm('真的删除行么', function(index) {
				$.ajax({
					type: "post",
					url: "http://127.0.0.1:1010/api/category/category_del.php",
					data: {
						'id': data.id
					},
					dataType: "text",
					success: function(data) {
						alert("删除成功");
						obj.del();
						layer.close(index);
					}
				});

			})
		} else if (obj.event === 'edit') {
			// layer.alert('编辑行：<br>'+ JSON.stringify(data))
			layer.open({
				type: 2,
				title: '编辑用户信息',
				area: ['600px', '600px'] //宽高
					,
				shadeClose: false,
				scrollbar: false // 父页面 滚动条 禁止
					,
				content: "../layer_window/category_edit.html",
				btn: ['提交', '取消']
					// 获取初始数据填入表单
					,
				success: function(layero, index) {
					var formSelects = layui.formSelects;
						var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
						body.contents().find("#image_shop").attr('src', "http://127.0.0.1:1010/"+data.image);
						body.contents().find("#image_link").text("http://127.0.0.1:1010/"+data.image);
						body.contents().find("#price").val(data.price);
						body.contents().find("#name").val(data.name);
						 var select = 'dd[lay-value=' + data.products + ']';
						 console.log(select);
						 body.contents().find('#product').siblings("div.layui-form-select").find('dl').find(select).click();
						body.contents().find("#type").val(data.type);
						body.contents().find("#variety").val(data.variety);
					}
					//提交操作
					,
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
					var name = body.contents().find("#title").val();
					var id = body.contents().find("#title").val();
					var image = body.contents().find("#image_link").text();
					var desc = body.contents().find("#desc").val();
					var price = body.contents().find("#price").val();
					$.ajax({
						type: "post",
						url: "http://127.0.0.1:1010/api/user/user_update.php",
						data: {
							"id":id,
							'name': name,
							'image': image,
							"nickName":nickName,
							'password': password,
							'sex': sex,
							"phone":phone,
						},
						dataType: "text",
						success: function(data) {
							alert("编辑成功");
							obj.del();
							layer.close(index);
							//执行重载
							window.parent.location.reload();

						}
					});
				},
				btn2: function(index, layero) {
					//按钮【按钮二】的回调
					layer.close(index);
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function() {
					//右上角关闭回调
					//return false 开启该代码可禁止点击该按钮关闭
				}
			});
		}
	});

	// 搜索
	var $ = layui.$,
		active = {
			reload: function() {
				var demoReload = $('#demoReload');

				//执行重载
				table.reload('category_table', {
					page: {
						curr: 1 //重新从第 1 页开始
					},
					where: {
						key: {
							id: demoReload.val()
						}
					}
				}, 'data');
			}
		};

	$('.demoTable .layui-btn').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

});
