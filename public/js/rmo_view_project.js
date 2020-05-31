
//TODAY_COLOR='#8FBC8F';
UTIL_OVER_COL = '#FFA500';
UTIL_100_COL='#00FA9A';//'#5588ff';
UTIL_75_COL='#98FB98';
UTIL_25_COL='#F0E68C';
UTIL_50_COL='#CCFF00';
UTIL_0_COL='#FFFFFF';
FTO_COL='#CDCDCD';

function Rmo(start,end)
{
	var self = this;
	this.start = new Date(start);
	this.end = new Date(end);
	this.today_color='#8FBC8F';
	this.ShowTable = function(tag)
	{
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
		console.log(this.start);
		console.log(this.end);
		this.dateArray = self.GenerateTableData(this.start.getFullYear(),this.start.getMonth()+1,this.end.getFullYear(),this.end.getMonth()+1);
		self.CreateTable('#'+tag);
	}
	this.PainttCell = function(element,value)
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
		if(value == -1)
			element.attr('title', 'FTO');
		else
			element.attr('title', 'Utilization '+value+'%');
	}
	this.ShowProject = function(project)
	{
	
		data = project.data;
		row = self.GenerateProjectRow(project);
		this.table.append(row);
		for(var i=0;i<data.length;i++)
		{
			var resource = data[i];
			for(var j=0;j<resource.projects.length;j++)
			{
				var project=resource.projects[j];
				row = self.GenerateResourceRow(resource,project);
				this.table.append(row);

				for(var k=0;k<project.utilization.length;k++)
				{
					var utilization = project.utilization[k];
					var id='#'+resource.id+"_"+project.id+"_"+utilization.week;
					self.PainttCell($(id),utilization.util )
				}
		    }
		}
	}
	this.CreateTable = function(tag)
	{
		var savebutton= '<button id="save" type="button">Save!</button>';

		var table = $('<table>');
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
		
		this.table = table;
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
	this.GenerateTableData =   function(startyear,startmonth,endyear,endmonth)
	{
		var dateArray = self._GetDates(new Date(startyear,startmonth-1,1), new Date(endyear,endmonth,0 ));
		j=0;
		k=0;
		l=0;
		yearArray=[];
		monthArray=[];
		weekArray=[];
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
			 
			
			today=0;
			if( self.isToday(dateArray[i]) )
			{
				console.log("Today is "+dateArray[i].toString());
				today=1;
			}
			weekArray[year+"_"+week][l++]={'week':week,'today':today,'date':dateArray[i].toString()};
		   
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
		//console.log(weekArray);
		return ret;
		//console.log(weekArray);
	}
	this.GenerateEmptyRow = function()
	{
		yearArray = this.dateArray.yearArray;
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
		html += '<th style="background-color:'+color+';" class="cell_year" colspan="'+colspan+'">'+'</th>';
	
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
		html += '</tr>';
		return $(html);
	}
	this.GenerateProjectRow = function(project)
	{
		var row = $('<tr></tr>');
		var cell=$('<td><span style="font-weight:bold;color:blue;margin-left:20px;margin-right:30px;">'+project.name+'</span></td>');
		row.append(cell);
		cell2=$('<td></td>');
		row.append(cell2);
		self.GenerateUtilCells(null,project,row); 
		return row;
	}
	this.GenerateResourceRow = function(resource,project)
	{
		var row = $('<tr></tr>');
		var cell=$('<td><span style="margin-left:30px;margin-right:30px;">'+resource.name+'</span></td>');
		row.append(cell);
		cell2=$('<td></td>');
		row.append(cell2);
		self.GenerateUtilCells(resource,project,row); 
		return row;
	}
	this.GenerateUtilCells = function(resource,project,row)
	{
		weekArray =  this.dateArray.weekArray;
		for (var week in weekArray) 
		{
			if(weekArray[week].length < 7)
				continue;
			colspan = Object.keys(weekArray[week]).length;
			cell = $('<td  width="40px;" colspan="'+colspan+'">'+'</td>');
			if(resource != null)
			{
				cell.attr('id', resource.id+"_"+project.id+"_"+week);
				cell.data('resourceid',resource.id);
			}
			else
				cell.attr('id', project.index+"_"+week);

			cell.addClass('pcell');
			cell.data('projectid',project.id);
			row.append(cell);
		}
	}
	this.GenerateCells = function(resource=null,project=null,tag='td',showweek=0)
	{
		weekArray =  this.dateArray.weekArray;
		var html='';
		var sub=0;
		var id='';
	   
	  // $('element').attr('id', 'value');
	   //$( "p" ).addClass( "myClass yourClass" );
		//var cls = 'cell_'+tag;
		var cls='';
		id='cell_';
		del='';
		if(resource != null)
		{
			//cls = 'cell_'+tag+' cell_resource';
			id=id+resource.id;
			del='_';
		}
		if(project != null)
		{
			//cls = 'cell_'+tag+' cell_project';
			id=id+del+project.id;
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
			if(project != null)
			   data=data+' data-pindex="'+project.id+'"';
			
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

}
