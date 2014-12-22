function initData(a){return a.data=a.data.map(function(a){for(key in a)a[key]="Månad"==key?parseDate(a[key]):+a[key];return a}),a}function initCharts(){$(".chart").each(function(){var a=$(this),b=a.attr("id"),c=a.attr("data-columns").split(","),d={};a.hasAttr("data-charts")&&(d.charts=a.attr("data-charts").split(",")),a.hasAttr("data-month")&&"latest"!==a.attr("data-month")&&(d.date=parseDate(a.attr("data-month"))),a.hasAttr("data-width")&&(d.width=a.attr("data-width")),a.hasAttr("data-height")&&(d.width=a.attr("data-height")),charts[b]=new BarChart(b,c,d)})}function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(location.search);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))}function sameYearAndMonth(a,b){return a.getFullYear()==b.getFullYear()&&a.getMonth()==b.getMonth()}function drawChartBuilderUI(){var a=d3.nest().key(function(a){return a.category}).entries(d3.values(dataObj.columns).filter(function(a){return"Månad"!==a.name}).sort(function(a,b){return d3.ascending(a.name,b.name)})),b=Handlebars.compile($("#template-columns").html());$("#columns").html(b(a));var c=dataObj.data.map(function(a){return{name:formatMonthYear(a["Månad"]),value:formatYearMonthDay(a["Månad"])}}).sort(function(a,b){return d3.descending(a.value,b.value)});c.unshift({name:"Senaste månaden",value:"latest"});var d=Handlebars.compile($("#template-months").html());$("#months").html(d(c)),$("#columns").children("li").click(function(){var a=$(this);a.parent("#columns").find(":checked").prop("checked",!1),a.next("ul").find("input").prop("checked",!0),chartBuilderUpdate()})}function chartBuilderUpdate(){var a=$("#columns :checked").map(function(){return $(this).val()}).toArray(),b=$("#months").val(),c=$("#charts :checked").map(function(){return $(this).val()}).toArray(),d=$("#height").val(),e=window.location.href+"chart.html?columns="+a.join(",")+"&month="+b+"&charts="+c.join(",")+"&height="+d;$("#url").text(e),$("#iframe-parent iframe").remove();new pym.Parent("iframe-parent",e,{})}function initChartBuilder(){$.getJSON(dataUrl,function(a){dataObj=initData(a),drawChartBuilderUI(),$("#columns ul").first().find("input").prop("checked",!0),chartBuilderUpdate()})}function addUrlParamsToChart(){$("#chart").attr({"data-columns":getQueryString("columns"),"data-month":getQueryString("month"),"data-charts":getQueryString("charts"),"data-height":getQueryString("height")})}function initSingleChart(){if(isIframe)var a=new pym.Child;$.getJSON(dataUrl,function(b){dataObj=initData(b),addUrlParamsToChart(),initCharts(),isIframe&&a.sendHeight()})}BarChart=function(){function a(a,b,c){var d=this;d.data=dataObj.data,d.columns=b,d.opts=$.extend({width:"auto",height:300,title:"",subtitle:"",sort:!1,showChange:!1,date:d.data[d.data.length-1]["Månad"]},c),d.id="#"+a,d.columnDictionary=dataObj.columns,d.$el=$(d.id),d.chartContainers={},d.chartContainers.today=d.$el.append($("<div/>").attr("class","chart-today")),d.label={today:"Arbetslöshet",change:"Förändring"},d.$el.append($("<button/>").text("Visa förändring").click(function(){$(this).text(d.opts.showChange?"Visa läget just nu":"Visa förändring"),d.update(d.opts.showChange?{showChange:!1}:{showChange:!0})})),b&&0!=b.length||console.error("Error: Add an array of columns"),d.charts={},d.chartSetup={bindto:d.id+" .chart-today",size:{height:d.opts.height},data:{x:"x",groups:[[d.label.today,d.label.change]],type:"bar",color:function(a,b){return b.id==d.label.today?a:b.value>0?"green":"red"}},axis:{x:{type:"category"},y:{tick:{format:function(a){return formatPercent(a/100)}}}},grid:{y:{lines:[{value:0,text:""}]}}},d.drawTodayChart()}return a.prototype.drawTodayChart=function(){var a=this,b=a.chartSetup;b.data.columns=a.getValues(),a.charts.today=c3.generate(b)},a.prototype.getValues=function(){var a=this,b=a.data.first(function(b){return sameYearAndMonth(b["Månad"],a.opts.date)});0==b.length&&console.error("Date error");var c,d=a.opts.date.sameMonthLastYear();c=a.data.first(function(a){return sameYearAndMonth(a["Månad"],d)});var e=[];if(a.columns.forEach(function(d){try{e.push({name:a.columnDictionary[d].name_short,today:b[d],change:b[d]-c[d]})}catch(f){console.error("Invalid column ("+d+" )",f)}}),a.opts.sort)try{e.sort(function(b,c){return d3.ascending(b[a.opts.sort],c[a.opts.sort])})}catch(f){console.error("Invalid sort key.",f)}e.unshift({name:"x",today:a.label.today,change:a.label.change});var g=[e.map(function(a){return a.name}),e.map(function(a){return a.today})];return a.opts.showChange&&g.push(e.map(function(a){return a.change})),g},a.prototype.update=function(a){var b=this;$.extend(b.opts,a),b.charts.today.load({columns:b.getValues()}),b.opts.showChange||b.charts.today.unload([b.label.change])},a}();var locale=d3.locale({decimal:",",thousands:" ",grouping:[3],currency:[""," kr"],dateTime:"%A %e %B %Y kl. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["måndag","tisdag","onsdag","torsdag","fredag","lördag","söndag"],shortDays:["må","ti","ons","to","fre","lö","sö"],months:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],shortMonths:["jan","feb","mars","apr","maj","jun","jul","aug","sept","okt","nov","dec"]}),parseDate=locale.timeFormat("%Y-%m-%d").parse;$.prototype.hasAttr=function(a){var b=$(this).attr(a);return"undefined"!=typeof b&&b!==!1},Array.prototype.first||(Array.prototype.first=function(a){"use strict";if(null==this)throw new TypeError;if("function"!=typeof a)throw new TypeError;for(var b=0;b<this.length;b++)if(a(this[b]))return this[b];return null}),Date.prototype.sameMonthLastYear=function(){return new Date(this.getFullYear()-1,this.getMonth(),1)};var formatPercent=locale.numberFormat(".1%"),formatPercentSmall=locale.numberFormat(".2%"),formatMonthYear=locale.timeFormat("%B %Y"),formatYearMonthDay=locale.timeFormat("%Y-%m-%d"),dataObj,charts={},isIframe=self!==top,key="1I7A8rydoRA6n28W6Tnt6nCpEYeUbI2J1dcVrEy54G7Y",mode="stage",dataUrl="https://s3-eu-west-1.amazonaws.com/tabletop-proxy/saco-arbetsmarknad-"+mode+"/"+key+".json";