$(function(){
		Handlebars.registerHelper("key_value", function(obj, fn) {
			var buffer = "",
					key;

			for (key in obj) {
					if (obj.hasOwnProperty(key)) {
							buffer += fn({key: key, value: obj[key]});
					}
			}

			return new Handlebars.SafeString(buffer);
	});


	var ChartBuilder = function(selector){
		this.selector = selector; 
		this.renderDiv = this.selector.replace("#","")
		this.element 	= $(selector);

		// renderTo: this.selector
		console.log(this.selector, this.element, this.renderDiv);
		this.seriesPicked = [];
		//this.chartType;
		this.chartTitle;
		this.chartSubTitle;
		this.chartYAxisTitle;
		this.startDate;
		this.endDate;
		this.dataSets = {
			installs: [ 1, 5, 10, 15, 20, 25, 30, 44, 47 ]
			, reviews: [ 2, 6, 11, 16, 21, 26, 31 ]
			, wineries: [ 3, 7, 12, 17, 22, 27, 32 ]
			, comments: [ 4, 8, 13, 18, 23, 28, 33 ]
		};

	};

	ChartBuilder.prototype.init = function(){
		var self = this;

		this.templateChartOptions = Handlebars.compile($('#chartOptionsTemplate').html());
	
		this.showChartOptions();

		this.element.on('click', '.createChart', function(){
			self.retrieveChartOptions.apply(self, arguments);
		});
	
	};

	ChartBuilder.prototype.lineChartCreation = function(){
		this.chartTitle = new Highcharts.Chart({
			chart: {
				renderTo: this.renderDiv
				, zoomType: 'x'
				, spacingRight: 20
			},
			title: {
				text: this.chartTitle
			},
			subtitle: {
				text: document.ontouchstart === undefined ?
					'Click and drag in the plot area to zoom in' :
					'Drag your finger over the plot to zoom in'
			},
			xAxis: {
				type: 'datetime',
				maxZoom: 24 * 3600000, // one day
				title: {
					text: null
				}
			},
			yAxis: {
				title: {
					text: this.chartYAxisTitle
				},
				min: 0.6,
				startOnTick: false,
				showFirstLabel: false
			},
			tooltip: {
				shared: true
			},
			legend: {
				enabled: true
			},
			plotOptions: {
			},

			series: this.seriesPicked
		});
	};

	ChartBuilder.prototype.barChartCreation = function(){
		this.chartTitle = new Highcharts.Chart({
			chart: {
					renderTo: this.renderDiv,
					type: 'bar'
			},
			title: {
					text: this.chartTitle
			},
			subtitle: {
					text: this.chartSubTitle
			},
			xAxis: {
					categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
					title: {
							text: null
					}
			},
			yAxis: {
					min: 0,
					title: {
							text: 'Population (millions)',
							align: 'high'
					},
					labels: {
							overflow: 'justify'
					}
			},
			tooltip: {
					formatter: function() {
							return ''+
									this.series.name +': '+ this.y +' millions';
					}
			},
			plotOptions: {
					bar: {
							dataLabels: {
									enabled: true
							}
					}
			},
			legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -100,
					y: 100,
					floating: true,
					borderWidth: 1,
					backgroundColor: '#FFFFFF',
					shadow: true
			},
			credits: {
					enabled: false
			},
			series: [{
					name: 'Year 1800',
					data: [107, 31, 635, 203, 2]
			}, {
					name: 'Year 1900',
					data: [133, 156, 947, 408, 6]
			}, {
					name: 'Year 2008',
					data: [973, 914, 4054, 732, 34]
			}]
		});
	}

	ChartBuilder.prototype.showChartOptions = function(){
		var chartOptionsHTML = this.templateChartOptions({dataSet: this.dataSets});
		console.log(this.element);
		this.element.html(chartOptionsHTML);
		this.element.find('.datepicker').datepicker();
	};

	ChartBuilder.prototype.retrieveChartOptions = function(){
		var self 							= this;
		//this.chartType 				= this.element.find('.chartTypeField').val();
		this.chartTitle 			= this.element.find('.chartTitleField').val();
		this.chartYAxisTitle 	= this.element.find('.chartYAxisTitleField').val();
		this.startDate 				= this.element.find('.startDateField').datepicker('getDate');
		this.endDate					= this.element.find('.endDateField').datepicker('getDate');

		this.element.find('.chartYAxisDataList li input').each(function(index, element){
			if($(element).prop('checked')){
				self.seriesPicked.push({
					name: $(element).val()
					, data: self.dataSets[$(element).val()]
					, pointInterval: 24 * 3600 * 1000
					, pointStart: self.startDate.getTime()
				});
			}
		});

		this.lineChartCreation();
	};


	// var chart1 = new ChartBuilder('#quadrant1')
	// , chart2 = new ChartBuilder('#quadrant2')
	// ,	chart3 = new ChartBuilder('#quadrant3')
	// , chart4 = new ChartBuilder('#quadrant4');

	// chart1.init();
	// chart2.init();
	// chart3.init();
	// chart4.init();

	var templateChartArea = Handlebars.compile($('#graphAreaTemplate').html());
	var graphNumber;
	var count = 0;

	$('.top').on('click', 'button', function(){
		count++;
		var newGraphAreaHTML = templateChartArea({number: count});
		$('.graphArea').append(newGraphAreaHTML);
		graphNumber = '#graph'+count;
		var graph = new ChartBuilder(graphNumber);
		graph.init();
	});


});