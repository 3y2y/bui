BUI.use(['bui/grid/header','bui/grid/body','bui/data'],function(Header,Body,Data){
	
	var Store = Data.Store;

	var columns = [{
			title : '表头1',
			dataIndex : 'a',
			sortState :'ASC'
		},{
			id: 'bkey',
			title : '表头2',
			dataIndex : 'b',
			showTip : true,
			sortable:false
		},{
			title : '表头3',
			dataIndex : 'c'
		},{
			id :'dkey',
			title : '测试Render',
			dataIndex : 'd',
			renderer : function(value,obj,index){
				if(value){
					return value * 2;
				}
			}
		}];
		
	
		var	header = new Header({
			render : '#J_Header',
			tableCls : '',
			columns: BUI.cloneObject(columns)
		});
		
	describe("测试 body 生成", function () {
		
		var body = new Body({
			render:'#J_Body',
			tableCls : '',
			columns : header.get('columns'),
			width : 800
			//header : header
		});
		header.render();
		body.render();
		var bodyEl = body.get('el'),
			tbodyEl = body.get('tbodyEl'),
			columns = body.get('columns');//.getColumns()
		
		it('测试Body容器生成',function(){
			expect(bodyEl).toNotBe(null);
			expect(tbodyEl).toNotBe(null);
			expect(tbodyEl).toNotBe(undefined);
			expect(bodyEl.hasClass('bui-grid-body')).toBeTruthy();
		});

		it('测试Body 生成行',function(){
			var data = [{},{},{}];
			body.showData(data);
			var children = tbodyEl.children('.bui-grid-row');
			expect(data.length == children.length).toBeTruthy();;
			
		});

		it('测试Body 生成单元格',function(){
			var data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee'}];
			body.showData(data);
			var children = tbodyEl.children('.bui-grid-row');
			expect(data.length == children.length);
			var firstRow = $(children[0]);
			expect(columns.length).toBe(firstRow.children('.bui-grid-cell').length - 1);
		});

		it('测试Body 宽度、高度',function(){
			var width = 500,
				height = 500;
			header.set('width',width);
			body.set('width',width);
			expect(bodyEl.width()).toBe(width);

			/*body.set('height',height);
			expect(bodyEl.width()).toBe(height);*/
		});

	});

	describe("测试 body 本地数据源", function () {
		var	store = new Store(),
			header = new Header({
				render : '#J_Header1',
				tableCls : '',
				columns: BUI.cloneObject(columns)
			});
		var body = new Body({
				render:'#J_Body1',
				tableCls : '',
				columns : header.get('columns'),
				store : store
			});
		header.render();
		body.render();
		var data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];
		var	bodyEl = body.get('el'),
			tbodyEl = body.get('tbodyEl');
		

		it('测试显示数据',function(){
			expect(tbodyEl.children('.bui-grid-row').length).toBe(0);
			store.setResult(data);
			expect(tbodyEl.children('.bui-grid-row').length).toBe(data.length);
		});
		it('测试添加数据',function(){
			var count = tbodyEl.children('.bui-grid-row').length;
			store.add({a:'122'});
			expect(tbodyEl.children('.bui-grid-row').length).toBe(count + 1);
		});
		it('测试删除数据',function(){
			var count = tbodyEl.children('.bui-grid-row').length;
			store.remove({a:'122'},function(obj1,obj2){
				return obj1.a === obj2.a;
			});
			expect(tbodyEl.children('.bui-grid-row').length).toBe(count - 1);
		});
		it('测试更新数据',function(){
			var record = store.find('a','cdd'),
				cell = body.findCell('bkey',record); 
				record.b = 'dddd'
			store.update(record);
			expect(cell).not.toBe(null);
			expect(cell.text()).toBe(record.b);
		});/**/
		it('测试显示tip',function(){
			var record = store.find('a','cdd'),
				cell = body.findCell('bkey',record),
				textEl = cell.find('.bui-grid-cell-text'); 
			expect(textEl.attr('title')).toBe('dddd');
		});

		
		it('测试renderer',function(){
			var records = store.getResult();
			$.each(records,function(index,record){
				var cell = body.findCell('dkey',record);
				if(record['d']){
					expect(parseInt(cell.text())).toBe(record['d'] * 2);
				}
			});
		});

		/*it('测试renderer 发生异常',function(){
			
		});

		it('测试本地排序数据',function(){
			
		});*/
		
	});
});