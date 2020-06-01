//TODAY_COLOR='#8FBC8F';
UTIL_OVER_COL = '#FFA500';
UTIL_100_COL='#00FA9A';//'#5588ff';
UTIL_75_COL='#98FB98';
UTIL_25_COL='#F0E68C';
UTIL_50_COL='#CCFF00';
UTIL_0_COL='#FFFFFF';
FTO_COL='#CDCDCD';

function Rmo(resources,projects,rmo)
{
	var self = this;
	this.start = new Date(rmo.start);
	this.end = new Date(rmo.end);
	this.resources=resources;
	this.projects=projects;
	window.utilization =100;
	window.nextindex = rmo.nextindex;
	window.owner = rmo.owner;
	this.dateArray = null;
	this.today_color='#8FBC8F';
	Date.prototype.addDays = function(days) 
	{
		var dat = new Date(this.valueOf())
		dat.setDate(dat.getDate() + days);
		return dat;
	}
	Date.prototype.getWeek = function() {
	  var onejan = new Date(this.getFullYear(),0,1);
	  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
	}
	this.isToday = (someDate) => {
	  const today = new Date()
	  return someDate.getDate() == today.getDate() &&
		someDate.getMonth() == today.getMonth() &&
		someDate.getFullYear() == today.getFullYear()
	}
	this.MonthName = function(month)
	{
		if(month == 0)
			return "January";
		else if(month == 1)
			return "February";
		else if(month == 2)
			return "March";
		else if(month == 3)
			return "April";
		else if(month == 4)
			return "May";
		else if(month == 5)
			return "June";
		else if(month == 6)
			return "July";
		else if(month == 7)
			return "August";
		else if(month == 8)
			return "September";
		else if(month == 9)
			return "October";
		else if(month == 10)
			return "November";
		else if(month == 11)
			return "December";
		return month;
	}
	this.ISO8601_week_no =  function(dt) 
	{
		var tdt = new Date(dt.valueOf());
		var dayn = (dt.getDay() + 6) % 7;
		tdt.setDate(tdt.getDate() - dayn + 3);
		var firstThursday = tdt.valueOf();
		tdt.setMonth(0, 1);
		if (tdt.getDay() !== 4) 
		{
			tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
		}
		return 1 + Math.ceil((firstThursday - tdt) / 604800000);
	}
	this.insert = function(str, index, value) 
	{
		return str.substr(0, index) + value + str.substr(index);
	}
	this.PreProcess = function(data)
	{
		if(window.nextindex === undefined)
			window.nextindex = 0;
		
		var startweek = '';
		for (var week in this.dateArray.weekArray) 
		{
			if(weekArray[week].length == 7)
			{
				startweek = week;
				if(startweek.length != 7)
					startweek = self.insert(startweek,5,'0');
				break;		
			}
		}
		
		for(var j=0;j<data.length;j++)
		{
			var resource = data[j];
			if(resource.projects === undefined)
				continue;
			for(var k=0;k<resource.projects.length;k++)
			{
				var project=resource.projects[k];
				var week = project.utilization[project.utilization.length-1];
	
				if(week.week.length != 7)
					week=self.insert(week.week,5,'0');
				else
					week=week.week;
				
				console.log(project.name+" "+week+" "+startweek);
				project.hide = 0;
				if(week < startweek)
				{
					//project.name = project.name+"D"; 
					project.hide = 1;
					//console.log(project.name+" Deete");
				}
				if(project.index >= window.nextindex)
				{
					window.nextindex = project.index+1;
				}	
			}

		}
			
		for(var i=0;i<this.resources.length;i++)
		{
			var resource = this.resources[i];
			//console.log(resource);
			for(var j=0;j<data.length;j++)
			{
				dresource = data[j];
				//console.log(parseInt(dresource.id));
				//console.log(parseInt(resource.id));
				if(parseInt(dresource.id) == parseInt(resource.id))
				{
					if(dresource.projects === undefined)
						dresource.projects = [];
					//[{'index':window.nextindex++,'id':-1,'name':'None','utilization':[]}];
					
					for(var k=0;k<dresource.projects.length;k++)
					{
						if(dresource.projects[k].utilization === undefined)
							dresource.projects[k].utilization=[];
						//dresource.projects[k].index=k;
					}
					break;
				}
			}
			if(j==data.length)// not found
			{
				//console.log(resource);
				resource.projects = [];
				//[{'index':window.nextindex++,'id':-1,'name':'None','utilization':[]}];
				data.push(resource);
			}
		}
		window.data=data;
	}
	this.DrawResourceRows=function()
	{
		for(var i=0;i<window.data.length;i++)
		{
			resource = window.data[i];
			resource.element = self.GenerateResourceRow(resource);
		}
	}
	this.DrawProjectRows=function()
	{
		for(var i=0;i<window.data.length;i++)
		{
			resource = window.data[i];
			parent=resource.element;
			for(var j=0;j<resource.projects.length;j++)
			{
				var project=resource.projects[j];
				parent = project.element = self.GenerateProjectRow(parent,resource,project);
				project.element.hide();
			}
		}
	}
	this.DeleteRowHandler = function()
	{
		var resourceid=$(this).data("resourceid");
		var projectindex=$(this).data("projectindex");
		
		for(var i=0;i<window.data.length;i++)
		{
			resource=window.data[i];
			if(resource.id == resourceid)
			{
				for(var j=0;j<resource.projects.length;j++)
				{
					if(resource.projects[j].index == projectindex)
					{
						var index = resource.projects[j].index;
						resource.projects[j].element.remove();
						resource.projects = resource.projects.filter(function(item) 
						{
							return item.index !== index
						})
					}	
				}
			}
		}
		for (var week in window.dateArray.weekArray) 
		{
			self.UpdateAccumulativeUtilization(resourceid,week);
		}
		$('#save').css('background-color','orange');
	}
	this.ProjectCellClickHandler = function()
	{
		var resourceid=$(this).data("resourceid");
		var projectindex=$(this).data("projectindex");
		var project = null;
		for(var i=0;i<data.length;i++)
		{
			resource=data[i];
			if(resource.id == resourceid)
			{
				for(var j=0;j<resource.projects.length;j++)
				{
					project = resource.projects[j];
					if(project.index == projectindex)
						break;
				}
				break;
			}
		}
		
		var fields = $(this).attr('id').split("_");	
		//project.utilization.push({'week':fields[2]+"_"+fields[3],'util':window.utilization});
		var obj = {'week':fields[2]+"_"+fields[3],'util':window.utilization};
		var index = $(this).data('index');
		if(index === undefined)
		{
			index = project.utilization.push(obj);
			$(this).data('index',index-1);
		}
		else
			project.utilization[index] = obj;
		//project.utilization[fields[2]+"_"+fields[3]]=window.utilization;
		//console.log(project);
		//Object.values(utilization.reduce((acc,cur)=>Object.assign(acc,{[cur.week]:cur}),{}))
		
		$(this).css('background-color',FTO_COL);
		//console.log(window.utilization);
		self.PaintProjectCell($(this),window.utilization);
		$('#save').css('background-color','orange');
	}
	this.ProjectSlectionHandler = function()
	{
		var resourceid=$(this).data("resourceid");
		var projectindex=$(this).data("projectindex");
		var project = null;
		for(var i=0;i<data.length;i++)
		{
			resource=data[i];
			if(resource.id == resourceid)
			{
				for(var j=0;j<resource.projects.length;j++)
				{
					project = resource.projects[j];
					if(project.index == projectindex)
						break;
				}
				break;
			}
		}
		//MUMTAZ
		//project.id =
		project.id = $(this).val()*1;
		project.name=$(this).find(":selected").text();
		$('#save').css('background-color','orange');
		//console.log($(this).val());
		//console.log($(this).find(":selected").text());				
	}
	this.PaintData = function()
	{
		//console.log(data);
		for(var i=0;i<data.length;i++)
		{
			var resource=data[i];
			for(var j=0;j<resource.projects.length;j++)
			{
				var project = resource.projects[j];
				//console.log(project);
				for(var k=0;k<project.utilization.length;k++)
				{
					var utilization=project.utilization[k];
					//console.log('#'+resource.id+"_"+project.index+"_"+utilization.week);
					var cell = $('#'+resource.id+"_"+project.index+"_"+utilization.week);
					if(cell.length)
					{
						cell.data('index',k);
						self.PaintProjectCell(cell,utilization.util);
					}
					//console.log(utilization.week);
					//console.log(utilization.util);
				}
				
			}
			//self.PaintProjectCell($(this),window.utilization);
		}
	}
	this.Show = function(tag,data,saveurl, savetoken)
	{
		window.data=data;
		this.dateArray = self.GenerateTableData(this.start.getFullYear(),this.start.getMonth()+1,this.end.getFullYear(),this.end.getMonth()+1);
		window.dateArray = this.dateArray;
		this.tag=tag;
		self.CreateTable('#'+tag);
		self.PreProcess(data);
		self.DrawResourceRows();
		self.DrawProjectRows();
		self.PaintData();
		window.utilization=100;
		$('#save').css('background-color','white');
		
		$('.select').change(self.ProjectSlectionHandler);
		$('.delete').click(self.DeleteRowHandler);
		$('.pcell').click(self.ProjectCellClickHandler);
		$('#save').click(function()
		{
			self.Save(saveurl,savetoken);
		});
		
		$('.addrow').click(
			function()
			{
				var resourceid=$(this).data("resourceid");
				console.log("Nextindex="+window.nextindex);
				for(var i=0;i<window.data.length;i++)
				{
					resource=window.data[i];
					var parent = resource.element;
					var newproject = {};
					if(resource.id == resourceid)
					{
						//console.log(resource.projects.length);
						if(resource.projects.length > 0)
						{
							var lastproject = resource.projects[resource.projects.length-1];
							newproject={'id':-1,'name':'None','index':window.nextindex++,'utilization':[]};
							parent = lastproject.element;
							//var parent = resource.element;
						}
						else
						{
							newproject={'id':-1,'name':'None','index':window.nextindex++,'utilization':[]};
							//var parent = resource.element;
						}	
						console.log(resource.projects);
						if(resource.projects === undefined)
							resource.projects = [];
						resource.projects.push(newproject);
						newproject.element = self.GenerateProjectRow(parent,resource, newproject);
						$('.delete').click(self.DeleteRowHandler);
						$('.pcell').click(self.ProjectCellClickHandler);
						$('.select').change(self.ProjectSlectionHandler);
					}
				}
				$('#save').css('background-color','orange');
			}
		 );
		$('.expand').click(
			function()
			{
				var expanded=$(this).data("expanded");
				var resourceid=$(this).data("resourceid");
				if( (expanded=== undefined)||(expanded=='0'))
				{
					for(var i=0;i<window.data.length;i++)
					{
						resource=window.data[i];
						if(resource.id == resourceid)
						{
							for(var j=0;j<resource.projects.length;j++)
							{
								if(resource.projects[j].hide)
									resource.projects[j].element.hide();
								else
									resource.projects[j].element.show();
							}
							resource.addrow.element.show();
						}
					}
					$(this).removeClass('fa-caret-square-o-down');
					$(this).addClass('fa-caret-square-o-up');
					$(this).data('expanded', '1');
				}
				else
				{
					for(var i=0;i<window.data.length;i++)
					{
						resource=window.data[i];
						if(resource.id == resourceid)
						{
							for(var j=0;j<resource.projects.length;j++)
							{
								resource.projects[j].element.hide();
							}
							resource.addrow.element.hide();
						}
					}
					$(this).addClass('fa-caret-square-o-down');
					$(this).removeClass('fa-caret-square-o-up');
					$(this).data('expanded', '0');
				}
			}
		);
		
		$.contextMenu(
		{
			autoHide:true,
			selector: '.pcell', 
			items: 
			{
				radio100: {
					name: "100%", 
					type: 'radio', 
					radio: 'radio', 
					value: '100', 
					selected: true
				},
				radio75: {
					name: "75%", 
					type: 'radio', 
					radio: 'radio', 
					value: '75'
				},
				radio50: {
					name: "50%", 
					type: 'radio', 
					radio: 'radio', 
					value: '50', 
					//disabled: true
				},
				radio25: {
					name: "25%", 
					type: 'radio', 
					radio: 'radio', 
					value: '25', 
					//disabled: true
				},
				radiofto: {
					name: "FTO", 
					type: 'radio', 
					radio: 'radio', 
					value: '-1'
				},
				radionone: {
					name: "Clear", 
					type: 'radio', 
					radio: 'radio', 
					value: '0'
				}
			}, 
			events: 
			{
				show: function(opt) 
				{
					// this is the trigger element
					//var $this = this;
					//console.log($(this).attr('id'));
					$(this).addClass('highlight');
					// import states from data store 
					rert = 
					{
						"name": "dd",
						"yesno": false,
						"select": null
					}
					data = this.data();
					//console.log(data);
					if(data.radio === undefined)
						data ={"radio":window.utilization.toString()};
					else
						data.radio = data.radio.toString();
					//data = {"radio": "75"};
					$.contextMenu.setInputValues(opt,data);
					// this basically fills the input commands from an object
					// like {name: "foo", yesno: true, radio: "3", &hellip;}
					
					var fields = $(this).attr('id').split("_");	
					var resourceid=fields[0];
					var projectindex=fields[1];
					lastid = resourceid+projectindex;
				}, 
				hide: function(opt) 
				{
					// this is the trigger element
					//var $this = this;
					//console.log(this.data());
					//console.log($(this).attr('id'));
					// export states to data store
					$(this).removeClass('highlight');
					ret = $.contextMenu.getInputValues(opt, this.data());
					
					var fields = $(this).attr('id').split("_");	
					
					var resourceid=fields[0];
					var projectindex=fields[1];
	
					if(lastid != resourceid+projectindex)
						return true;
					
					$('#save').css('background-color','orange');
					lastid = 0;
					
					console.log("resource="+resourceid);
					console.log("projectindex="+projectindex);
					var found=0;
					for(var i=0;i<window.data.length;i++)
					{
						var resource=window.data[i];
						console.log("Resourceid="+resource.id);
						//console.log(resource);
						//console.log(window.data);
						for(var j=0;j<resource.projects.length;j++)
						{
							var project=resource.projects[j];
							//console.log("Project index ="+project.index);
							if(project.index == projectindex)
							{
								//console.log(window.utilization);
								console.log("Here");
								var obj = {'week':fields[2]+"_"+fields[3],'util':ret.radio};
								var index = $(this).data('index');
								if(index === undefined)
								{
									index = project.utilization.push(obj);
									$(this).data('index',index-1);
								}
								else
									project.utilization[index] = obj;
								
								console.log("RCH"+index);
								//var obj = {'week':fields[2]+"_"+fields[3],'util':window.utilization};
								//var index = project.utilization.push(obj);
								//project.utilization[fields[2]+"_"+fields[3]]=window.utilization;
								
								found=1;
								break;
							}
						}
		                if(found)
							break;
					}
					//console.log(fields);
		//project.utilization.push({'week':fields[2]+"_"+fields[3],'util':window.utilization});
					
					self.PaintProjectCell( $(this),ret.radio );
					return true;
					//console.log(ret);
					// this basically dumps the input commands' values to an object
					// like {name: "foo", yesno: true, radio: "3", &hellip;}
				}
			}
		});
	}
	this.PaintProjectCell = function(element,value)
	{
		//console.log(element.data('index'));
		if( value == -1)
		{
			element.css('background-color',FTO_COL);
		}
		else if( value == 100)
		{
			element.css('background-color',UTIL_100_COL);
		}
		else if( value == 75)
		{
			element.css('background-color',UTIL_75_COL);
		 }
		else if( value == 50)
		{
			element.css('background-color',UTIL_50_COL);
		}
		else if( value == 25)
		{
			element.css('background-color',UTIL_25_COL);
		}
		else
		{
			element.css('background-color',UTIL_0_COL);	
		}
		element.data( "radio", value ); 
		if(value == -1)
			element.attr('title', 'FTO');
		else
			element.attr('title', 'Utilization '+value+'%');
		var fields = element.attr('id').split("_");
		self.UpdateAccumulativeUtilization(fields[0],fields[2]+"_"+fields[3]);
		//updatedcells.push(element);
		window.utilization=value;
	}
	this.UpdateAccumulativeUtilization = function(resourceid,week)
	{	   
	   rcell = $('#'+resourceid+'_'+week);
	   //acc_cell = $(cells[0]);
	   acc = 0;
	   for(i=0;i<data.length;i++)
	   {
		   resource=data[i];
		   if(resource.id == resourceid)
		   {
			   for(var j=0;j<resource.projects.length;j++)
			   {
					var project=resource.projects[j];
					var pcell = $('#'+resourceid+'_'+project.index+"_"+week);
					//console.log('#'+resourceid+'_'+project.index+"_"+week);
					//console.log(pcell);
					var utilization = pcell.data('radio');
					//console.log(utilization);
					if(utilization === undefined)
						continue;
					utilization = parseInt(utilization);
					if(utilization == -1)
					{
						acc = -1;
						break;
					}
					else
						acc += utilization;
			   }   
		   }
	   }
	   self.PaintResourceCell(rcell,acc);
	}
	this.PaintResourceCell = function(element, value)
	{
		if( value == -1)
		{
			element.css('background-color',FTO_COL);
		}
		else if( value == 100)
		{
			element.css('background-color',UTIL_100_COL);
		}
		else if( value == 75)
		{
			element.css('background-color',UTIL_75_COL);
		 }
		else if( value == 50)
		{
			element.css('background-color',UTIL_50_COL);
		}
		else if( value == 25)
		{
			element.css('background-color',UTIL_25_COL);
		}
		else if( value > 100)
			element.css('background-color',UTIL_OVER_COL);
		else
		{
			element.css('background-color',UTIL_0_COL);
			
		}
		if(value == -1)
			element.attr('title', 'FTO');
		else
			element.attr('title', 'Utilization '+value+'%');
		element.data( "acc", value ); 
	}
	
	this._GetDates =  function(startDate, stopDate) 
	{
		var dateArray = new Array();
		var currentDate = startDate;
		while (currentDate <= stopDate) 
		{
			dateArray.push(currentDate)
			currentDate = currentDate.addDays(1);
		}
		return dateArray;
	}
	this.CreateTable = function(tag)
	{
		var savebutton= '<button id="save" type="button">Save!</button>';

		table = $('<table>');
		table.addClass("RmoTable");
		
		//$(tag).append($(savebutton));
		
		$(tag).append(table);
		
		table.append('<tr>sss</tr>');
		
		$(tag).append('<br>');
		
		emptyrow = self.GenerateEmptyRow();
		table.append(emptyrow);
		
		yearrow = self.GenerateYearRow();
		table.append(yearrow);
		
		monthrow = self.GenerateMonthRow();
		table.append(monthrow);
		
		weekrow = self.GenerateWeekRow();
		table.append(weekrow);
		
		sprintrow = self.GenerateSprintRow();
		table.append(sprintrow);
		
		this.table = table;
	}
	this.GenerateProjectRow=function(parent,resource,project)
	{
		//console.log("------------->"+project.hide);
		var deleteicon=$('<i title="Delete row" style="margin-top:3px;font-size:12px; float:right;" class="fa fa-times-circle" aria-hidden="true"></i>');
		

		var select=$('<select></select>');
		if(project.id == -1)
			select.append('<option value="-1" selected>Select</option>');
		else
			select.append('<option value="-1">Select</option>');
		
		found=0;
		//console.log(this.projects);
		for (var i=0;i<this.projects.length;i++) 
		{
			if(this.projects[i].id == project.id)
			{
				select.append('<option value="'+this.projects[i].id+'" selected>'+this.projects[i].name+'</option>');
				found=1;
			}
			else
				select.append('<option value="'+this.projects[i].id+'">'+this.projects[i].name+'</option>');
		}
		if(found==0)
		{
			if(project.id >= 0)
				select.append('<option value="'+project.id+'" selected>'+project.name+'</option>');

		}
		/////////////////////////////////////////////////////////////////////
		
		deleteicon.addClass('delete');
		deleteicon.data('resourceid',resource.id);
		deleteicon.data('projectindex',project.index);

		
		select.attr('id', 'select_'+resource.id+"_"+project.index);
		select.data('resourceid',resource.id);
		select.data('projectindex',project.index);
		select.addClass('select');
		
		var row = $('<tr></tr>');
		var cell=$('<td></td>');
		cell.append(select);
		row.append(cell);
		cell2=$('<td></td>');
		cell2.append($(deleteicon));
		
		row.append(cell2);
		cells = self.GenerateProjectRowCells(resource,project,row); 
		//parent.append(row);
		parent.after(row);
		
		return row;
	}
	this.GenerateResourceRow= function(resource) 
	{
		expandicon = $('<i style="float:left;margin-right:5px" class="fa fa-caret-square-o-down" aria-hidden="true"></i>');
		//dropupicon = $('<i class="fa fa-caret-square-o-up" aria-hidden="true"></i>');
		addrowicon= $('<i title="Add Row" style="font-size:10px;float:right;margin-top:3px;" class="fa fa-plus" aria-hidden="true"></i>');
		resourcename= $('<span style="margin-left:5px;">'+resource.name+'</span>');
		
		expandicon.addClass('expand');
		expandicon.data('resourceid',resource.id);
		
		addrowicon.addClass('addrow');
		addrowicon.data('resourceid',resource.id);
		resource.addrow = {};
		resource.addrow.element = addrowicon;
		resource.addrow.element.hide();
		
		row = $('<tr></tr>');
		cell=$('<td style="font-size:17px;" width="100%"></td>');
		cell.append(expandicon);
		cell.append(resourcename);
		//cell.addClass('fa fa-plus-circle');
		row.append(cell);
		cell2=$('<td></td>');
		cell2.append(addrowicon);
		row.append(cell2);
		cells = self.GenerateResourceRowCells(resource,row); 
		row.append(cells);
		row.css('background-color','#F0F8FF');
		//html += '</tr>';
		//var row = $(html)
		this.table.append(row);
		//$('#'+idadd).hide();
		return row;
	}
	this.GenerateEmptyRow = function()
	{
		yearArray = this.dateArray.yearArray;
		
		var savebutton= '<button id="save" type="button">Save!</button>';

		html = '<tr>';
		html += '<th class="cell_year"></th>';
		html += '<th class="cell_year">&nbsp&nbsp&nbsp&nbsp</th>';
		color='#DCDCDC';
		colspan = 0;
		for (var year in yearArray) 
		{
			if(yearArray[year].includes(1))
				color=this.today_color;
			else
			{
				if(color==this.today_color)
					color='#FFFFFF';
			}
			colspan += Object.keys(yearArray[year]).length;
		}
		html += '<th style="background-color:'+color+';" class="cell_year" colspan="'+colspan+'">'+savebutton+'</th>';
	
		html += '</tr>';
		return $(html);
	}
	this.GenerateYearRow = function()
	{
		yearArray = this.dateArray.yearArray;
		
		var savebutton= '<button id="save" type="button">Save!</button>';

		html = '<tr class="row_year">';
		html += '<th class="cell_year"></th>';
		html += '<th class="cell_year">&nbsp&nbsp&nbsp&nbsp</th>';
		color='#DCDCDC';
		for (var year in yearArray) 
		{
			if(yearArray[year].includes(1))
				color=this.today_color;
			else
			{
				if(color==this.today_color)
					color='#FFFFFF';
			}
			colspan = Object.keys(yearArray[year]).length;
			html += '<th style="background-color:'+color+';" class="cell_year" colspan="'+colspan+'">'+year+'</th>';
		}
		html += '</tr>';
		return $(html);
	}
	this.GenerateMonthRow =  function()
	{
		monthArray = this.dateArray.monthArray;
		html = '<tr class="row_month">';
		html += '<th class="cell_month" >&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspMonth&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</th>';
		html += '<th class="cell_month" ></th>';
		color='#DCDCDC';
		for (var month in monthArray) 
		{
			if(monthArray[month].includes(1))
				color=this.today_color;
			else
			{
				if(color==this.today_color)
					color='#FFFFFF';
			}
			colspan = Object.keys(monthArray[month]).length;
			html += '<th style="background-color:'+color+';" class="cell_month" colspan="'+colspan+'">'+self.MonthName(month.substring(5))+'</th>';
		}
		html += '</tr>';
		return $(html);
	}
	this.GenerateWeekRow = function()
	{
		weekArray = this.dateArray.weekArray;
		var html = '<tr class="row_week">';
		html += '<th  class="cell_week"><span style="margin-left:30px;margin-right:30px;">Week</span></th>';
		html += '<th  class="cell_week"></th>';
		html += self.GenerateCells(null,null,'th',1);
		/*sub=0;
		for (var week in weekArray) 
		{
			colspan = Object.keys(weekArray[week]).length;
			week = week.substring(5);
			if(week==1&&colspan==0)
				sub=1;
			else if(week==1)
				sub=0;
			 
			week=week-sub;
			if(week < 10)
				week = "&nbsp&nbsp"+week+"&nbsp&nbsp";
			else
				week = "&nbsp"+week+"&nbsp";
			if(colspan>0)
				html += '<th width="40px;" style="font-size:10px;" colspan="'+colspan+'">'+week+'</th>';
		 }*/
		 html += '</tr>';
		 return $(html);
	}
	
	this.GenerateSprintRow =  function()
	{
		sprintArray = this.dateArray.sprintArray;
		html = '<tr class="row_sprint">';
		html += '<td style="text-align: center;font-weight:bold" class="cell_sprint" >Sprint</td>';
		html += '<td class="cell_sprint" ></td>';
		color='#DCDCDC';
		var last_colspan = 0;
		for (var sprint in sprintArray) 
		{
			if(sprintArray[sprint].includes(1))
				color=this.today_color;
			else
			{
				if(color==this.today_color)
					color='#FFFFFF';
			}
			colspan = Object.keys(sprintArray[sprint]).length;
			//if(colspan < 21)
			//{
			//	continue;
			//}
			if(colspan < 7)
				continue
			else if(colspan < 14)
				colspan=7;
			else if(colspan < 21)
				colspan=14;
			//console.log("colspan "+colspan+ "  "+sprint);
			if(colspan < 14)
				sprint='';
			html += '<td width="40px;" style="text-align: center; background-color:'+color+';" class="cell_sprint" colspan="'+colspan+'">'+sprint.substring(5)+'</td>';
		}
		html += '</tr>';
		return $(html);
	}
	this.GenerateResourceRowCells = function(resource,row)
	{
		weekArray =  this.dateArray.weekArray;
		for (var week in weekArray) 
		{
			if(weekArray[week].length < 7)
				continue;
			colspan = Object.keys(weekArray[week]).length;
			cell = $('<td  width="40px;" colspan="'+colspan+'">'+'</td>');
			cell.attr('id', resource.id+"_"+week);
			row.append(cell);
		}
	}
	this.GenerateProjectRowCells = function(resource,project,row)
	{
		weekArray =  this.dateArray.weekArray;
		for (var week in weekArray) 
		{
			if(weekArray[week].length < 7)
				continue;
			colspan = Object.keys(weekArray[week]).length;
			cell = $('<td  width="40px;" colspan="'+colspan+'">'+'</td>');
			cell.attr('id', resource.id+"_"+project.index+"_"+week);
			cell.addClass('pcell');
			cell.data('resourceid',resource.id);
			cell.data('projectindex',project.index);
			row.append(cell);
		}
	}
	this.GenerateCells = function(resource=null,project_index=null,tag='td',showweek=0)
	{
		weekArray =  this.dateArray.weekArray;
		var html='';
		var sub=0;
		var id='';
	   
	  // $('element').attr('id', 'value');
	   //$( "p" ).addClass( "myClass yourClass" );
		var cls = 'cell_'+tag;
		if(resource != null)
		{
			cls = 'cell_'+tag+' cell_resource';
			id='rcell_'+resource.id;
		}
		if(project_index != null)
		{
			cls = 'cell_'+tag+' cell_project';
			id='pcell_'+resource.id+"_"+project_index;
		}
		
		//var today = new Date();
		// todayyear  = today.getFullYear();
		color='#DCDCDC';
		currentweek=0;
		for (var week in weekArray) 
		{
			if(weekArray[week].length < 7)
				continue;
			
			if(currentweek == 0)
			{
				for(key in weekArray[week])
				{
					//console.log(weekArray[week][key]);
					if(weekArray[week][key].today == 1)
					{
						//console.log(weekArray[week][key]);
						currentweek=1;
					}
					
				}
			}
			
			colspan = Object.keys(weekArray[week]).length;
			//console.log(week);
			//console.log(colspan);
			year = week.substring(0,4);
			week = week.substring(5);
			var data='data-year="'+year+'"';
			data= data+' data-week="'+week+'"';
			if(resource !=  null)
				ncls = cls+' column_'+resource.id+'_'+year+'_'+week;
			else
				ncls = cls;
			
			if(resource != null)
				data=data+' data-resource="'+resource.id+'"';
			if(project_index != null)
			   data=data+' data-pindex="'+project_index+'"';
			
			data=data+' data-tag="'+this.tag+'"';
			
			nid = id+"_"+year+"_"+week;
			if(week==1&&colspan==0)
				sub=1;
			else if(week==1)
				sub=0;
			 
			//week=ParseInt(week)+ParseInt(sub);
			if(showweek)
			{
				if(week < 10)
					week = "&nbsp&nbsp"+week+"&nbsp&nbsp";
				else
					week = "&nbsp"+week+"&nbsp";
			}
			else
				week='';
			if(colspan>0)
			{
				if(currentweek==1 && showweek)
				{
					html += '<'+tag+' '+data+' style="background-color:'+this.today_color+';" class="'+ncls+'" id="'+nid+'" width="40px;" colspan="'+colspan+'">'+week+'</'+tag+'>';
					color = '#FFFFFF';
					currentweek=2;
				}
				else if(showweek)
					html += '<'+tag+' '+data+' style="background-color:'+color+';" class="'+ncls+'" id="'+nid+'" width="40px;" colspan="'+colspan+'">'+week+'</'+tag+'>';
				else
					html += '<'+tag+' '+data+' class="'+ncls+'" id="'+nid+'" width="40px;" colspan="'+colspan+'">'+week+'</'+tag+'>';
			}
		 }
		 return html;
	}

	this.GenerateTableData =   function(startyear,startmonth,endyear,endmonth)
	{
		var dateArray = self._GetDates(new Date(startyear,startmonth-1,1), new Date(endyear,endmonth,0 ));
		j=0;
		k=0;
		l=0;
		yearArray=[];
		monthArray=[];
		weekArray=[];
		sprintArray=[];
		for (i = 0; i < dateArray.length; i ++ ) 
		{
			week=self.ISO8601_week_no(dateArray[i]);
			year=dateArray[i].getFullYear();
			if(week == 1 && dateArray[i].getMonth() == 11)// Boundary condition  
				year = year+1;
			
			if(week == 53 && dateArray[i].getMonth() == 0)// Boundary condition  
				year = year-1;
			
			if(weekArray[year+"_"+week] === undefined)
			{
				weekArray[year+"_"+week]=[]
				l=0;
			}
			//console.log("---->"+week);
			
			
			
			today=0;
			if( self.isToday(dateArray[i]) )
			{
				console.log("Today is "+dateArray[i].toString());
				today=1;
			}
			weekArray[year+"_"+week][l++]={'week':week,'today':today,'date':dateArray[i].toString()};
		   
		    var sprint = Math.floor(week/3);
			if(week%3 > 0)
				sprint = sprint+1;
			if(sprintArray[year+"_"+sprint] === undefined)
				sprintArray[year+"_"+sprint]=[];
			
			sprintArray[year+"_"+sprint].push(today);
			///////////////////////////////////////////////////////////////////
		   
			year=dateArray[i].getFullYear();
			if(yearArray[year] === undefined)
			{
				yearArray[year]=[]
				j=0;
			}
			
			
			yearArray[year][j++] = today;
			
			month=dateArray[i].getMonth();
			if(monthArray[year+"_"+month] === undefined)
			{
				monthArray[year+"_"+month]=[]
				k=0;
			}
			monthArray[year+"_"+month][k++]=today;
		}
		ret = {};
		ret.weekArray = weekArray;
		ret.monthArray = monthArray;
		ret.yearArray = yearArray;
		ret.sprintArray = sprintArray;
		console.log(sprintArray);
		console.log(weekArray);
		//console.log(weekArray);
		return ret;
		//console.log(weekArray);
	}
	this.Load =  function()
	{
		$.ajax({
           type: "GET",
           url: "load.php",
           dataType: "json",
           success: function (msg) 
		   {
      
           }
       });
		
	}
	this.Save =  function(url, token)
	{	
		var savobj = {};
		savobj.rmo = {};
		//console.log(window.data);
		savobj.rmo.data=JSON.parse(JSON.stringify(window.data));
		//savobj.rmo.start = this.start.toISOString().split('T')[0];
		//savobj.rmo.end = this.end.toISOString().split('T')[0];
		//savobj.rmo.nextindex = window.nextindex;
		//savobj.rmo.owner = window.owner;
		savobj._token = token;
		for(var i=0;i<savobj.rmo.data.length;i++)
		{
			resource=savobj.rmo.data[i];
			delete  resource.element;
			delete resource.addrow;
			for(var j=0;j<resource.projects.length;j++)
			{
				var project=resource.projects[j];
				delete  project.element;
			}
		}
		//console.log(savobj);
		savobj.rmo =  JSON.stringify(savobj.rmo)
		$.ajax({
           type: "POST",
           url: url,
           dataType: "json",
		   //contentType: false,
		   //processData: false,
           success: function (msg) 
		   {
			   //console.log(CryptoJS.MD5(datatosend).toString());
				//alert(msg.result);
				$('#save').css('background-color','white');
           },
		   error:function (msg) 
		   {
      
           },
           data: savobj
       });
		
		
	}
}

