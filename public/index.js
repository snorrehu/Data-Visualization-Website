var fileInput = document.getElementById('csv');
let csvInput;
let svg;

readFile = function() {
	var reader = new FileReader();
	reader.onload = function() {
		csvCall(reader.result);
	};
	// start reading the file. When it is done, calls the onload event defined above.
	reader.readAsDataURL(fileInput.files[0]);
};

fileInput.addEventListener('change', readFile);

function getByUrl(event) {
	event.preventDefault();
	csvInput = document.getElementById('csvUrl').value;
	csvCall(csvInput);
}

function csvCall(csvInput) {
	d3.select('svg').remove();
	d3.select('span').remove();
	d3.select('select').remove();
	d3.select('span').remove();
	d3.select('select').remove();

	d3.csv(csvInput, function(data) {
		// CSV section
		var body = d3.select('body');
		var headers = d3.keys(data[0]);
		let selectData = [];
		var secondLine = d3.values(data[1]);
		var headerRegex = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
		var indexer = 0;

		headers.forEach(function(headers, index) {
			if (headers === '') {
				selectData[index] = { text: 'Unknown' };
			} else if (headerRegex.test(secondLine[indexer]) === true) {
				selectData[index] = { text: headers };
			}
			indexer++;
		});

		/*
    headers.forEach(function(headers, index) {
        selectData[index] = {"text": headers }
    });
    */

		console.log(selectData);

		// Select X-axis Variable
		var spanX = body.append('span').text('Select X-Axis variable: ');
		var xInput = body
			.append('select')
			.attr('id', 'xSelect')
			.on('change', xChange)
			.selectAll('option')
			.data(selectData)
			.enter()
			.append('option')
			.attr('value', function(d) {
				return d.text;
			})
			.text(function(d) {
				return d.text;
			});
		body.append('br');

		// Select Y-axis Variable
		var span = body.append('span').text('Select Y-Axis variable: ');
		var yInput = body
			.append('select')
			.attr('id', 'ySelect')
			.on('change', yChange)
			.selectAll('option')
			.data(selectData)
			.enter()
			.append('option')
			.attr('value', function(d) {
				return d.text;
			})
			.text(function(d) {
				return d.text;
			});
		body.append('br');

		// Variables
		var body = d3.select('body');
		var margin = { top: 50, right: 50, bottom: 50, left: 50 };
		var h = 500 - margin.top - margin.bottom;
		var w = 500 - margin.left - margin.right;
		var formatPercent = d3.format('.1f');
		// Scales
		var colorScale = d3.scale.category20();
		var xScale = d3.scale
			.linear()
			.domain([
				d3.min([
					0,
					d3.min(data, function(d) {
						return d.text;
					})
				]),
				d3.max([
					0,
					d3.max(data, function(d) {
						return d.text;
					})
				])
			])
			.range([0, w]);
		var yScale = d3.scale
			.linear()
			.domain([
				d3.min([
					0,
					d3.min(data, function(d) {
						return d.text;
					})
				]),
				d3.max([
					0,
					d3.max(data, function(d) {
						return d.text;
					})
				])
				// d3.max([0,d3.max(data,function (d) { return d['petal_length'] })])
			])
			.range([h, 0]);

		// SVG
		svg = body
			.append('svg')
			.attr('height', h + margin.top + margin.bottom)
			.attr('width', w + margin.left + margin.right)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// X-axis
		var xAxis = d3.svg
			.axis()
			.scale(xScale)
			.tickFormat(formatPercent)
			.ticks(5)
			.orient('bottom');

		// Y-axis
		var yAxis = d3.svg
			.axis()
			.scale(yScale)
			.tickFormat(formatPercent)
			.ticks(5)
			.orient('left');

		// Circles
		var circles = svg
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', function(d) {
				return xScale(d['value']);
			})
			.attr('cy', function(d) {
				return yScale(d['value']);
			})
			.attr('r', '5')
			.attr('stroke', 'black')
			.attr('stroke-width', 1)
			.attr('fill', function(d, i) {
				return colorScale(i);
			});

		// X-axis
		svg.append('g')
			.attr('class', 'axis')
			.attr('id', 'xAxis')
			.attr('transform', 'translate(0,' + h + ')')
			.call(xAxis)
			.append('text') // X-axis Label
			.attr('id', 'xAxisLabel')
			.attr('y', 30)
			.attr('x', w / 2)
			.attr('dy', '.71em')
			.style('text-anchor', 'middle');
		//.text('good values')

		// Y-axis
		svg.append('g')
			.attr('class', 'axis')
			.attr('id', 'yAxis')
			.call(yAxis)
			.append('text') // y-axis Label
			.attr('id', 'yAxisLabel')
			.attr('transform', 'rotate(-90)')
			.attr('x', 0 - h / 2)
			.attr('y', 0 - margin.left)
			.attr('dy', '1em')
			.style('text-anchor', 'middle');
		//.text('the coolest values')

		function yChange() {
			var value = this.value; // get the new y value
			yScale // change the yScale
				.domain([
					d3.min([
						0,
						d3.min(data, function(d) {
							return d[value];
						})
					]),
					d3.max([
						0,
						d3.max(data, function(d) {
							return d[value];
						})
					])
				]);
			yAxis.scale(yScale); // change the yScale
			d3.select('#yAxis') // redraw the yAxis
				.transition()
				.duration(10)
				.call(yAxis);
			d3.select('#yAxisLabel') // change the yAxisLabel
				.text(value);
			d3.selectAll('circle') // move the circles
				.transition()
				.duration(10)
				.delay(function(d, i) {
					return i * 10;
				})
				.attr('cy', function(d) {
					return yScale(d[value]);
				});
		}

		function xChange() {
			var value = this.value; // get the new x value
			xScale // change the xScale
				.domain([
					d3.min([
						0,
						d3.min(data, function(d) {
							return d[value];
						})
					]),
					d3.max([
						0,
						d3.max(data, function(d) {
							return d[value];
						})
					])
				]);
			xAxis.scale(xScale); // change the xScale
			d3.select('#xAxis') // redraw the xAxis
				.transition()
				.duration(10)
				.call(xAxis);
			d3.select('#xAxisLabel') // change the xAxisLabel
				.transition()
				.duration(10)
				.text(value);
			d3.selectAll('circle') // move the circles
				.transition()
				.duration(10)
				.delay(function(d, i) {
					return i * 10;
				})
				.attr('cx', function(d) {
					return xScale(d[value]);
				});
		}
	});
}
