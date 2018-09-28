/*d3.csv("iris.csv", function (flowers) {

    // Size parameters.
    var size = 160,
        padding = 10,
        n = 4,
      traits = ["sepal_length", "sepal_width", "petal_length", "petal_width"];

    // Position scales.
    var x = {}, y = {};
    traits.forEach(function (trait) {
        // Coerce values to numbers.
        flowers.forEach(function (d) { d[trait] = +d[trait]; });

        var value = function (d) { return d[trait]; },
            domain = [d3.min(flowers, value), d3.max(flowers, value)],
            range = [padding / 2, size - padding / 2];
        x[trait] = d3.scale.linear().domain(domain).range(range);
        y[trait] = d3.scale.linear().domain(domain).range(range.reverse());
    });

    // Axes.
    var axis = d3.svg.axis()
        .ticks(5)
        .tickSize(size * n);

    // Brush.
    var brush = d3.svg.brush()
        .on("brushstart", brushstart)
        .on("brush", brush)
        .on("brushend", brushend);

    // Root panel.
    var svg = d3.select("body").append("svg:svg")
        .attr("width", 1280)
        .attr("height", 800)
        .append("svg:g")
        .attr("transform", "translate(359.5,69.5)");

    // Legend.
    var legend = svg.selectAll("g.legend")
        .data(["setosa", "versicolor", "virginica"])
        .enter().append("svg:g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(-179," + (i * 20 + 594) + ")"; });

    legend.append("svg:circle")
        .attr("class", String)
        .attr("r", 3);

    legend.append("svg:text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(function (d) { return "Iris " + d; });

    // X-axis.
    svg.selectAll("g.x.axis")
        .data(traits)
        .enter().append("svg:g")
        .attr("class", "x axis")
        .attr("transform", function (d, i) { return "translate(" + i * size + ",0)"; })
        .each(function (d) { d3.select(this).call(axis.scale(x[d]).orient("bottom")); });

    // Y-axis.
    svg.selectAll("g.y.axis")
        .data(traits)
        .enter().append("svg:g")
        .attr("class", "y axis")
        .attr("transform", function (d, i) { return "translate(0," + i * size + ")"; })
        .each(function (d) { d3.select(this).call(axis.scale(y[d]).orient("right")); });

    // Cell and plot.
    var cell = svg.selectAll("g.cell")
        .data(cross(traits, traits))
        .enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function (d) { return "translate(" + d.i * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function (d) { return d.i == d.j; }).append("svg:text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function (d) { return d.x; });

    function plot(p) {
        var cell = d3.select(this);

        // Plot frame.
        cell.append("svg:rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        // Plot dots.
        cell.selectAll("circle")
            .data(flowers)
            .enter().append("svg:circle")
            .attr("class", function (d) { return d.species; })
            .attr("cx", function (d) { return x[p.x](d[p.x]); })
            .attr("cy", function (d) { return y[p.y](d[p.y]); })
            .attr("r", 3);

        // Plot brush.
        cell.call(brush.x(x[p.x]).y(y[p.y]));
    }

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brush.data !== p) {
            cell.call(brush.clear());
            brush.x(x[p.x]).y(y[p.y]).data = p;
        }
    }

    // Highlight the selected circles.
    function brush(p) {
        var e = brush.extent();
        svg.selectAll(".cell circle").attr("class", function (d) {
            return e[0][0] <= d[p.x] && d[p.x] <= e[1][0]
                && e[0][1] <= d[p.y] && d[p.y] <= e[1][1]
                ? d.species : null;
        });
    }

    // If the brush is empty, select all circles.
    function brushend() {
        if (brush.empty()) svg.selectAll(".cell circle").attr("class", function (d) {
            return d.species;
        });
    }

    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({ x: a[i], i: i, y: b[j], j: j });
        return c;
    }
});*/

d3.csv('iris.csv',function (data) {
// CSV section
    var body = d3.select('body')
    var headers = d3.keys(data[0]);

    let selectData = [];

    headers.forEach(function(headers, index) {
        selectData[index] = {"text": headers }
    });

    console.log(selectData)


    // Select X-axis Variable
    var span = body.append('span')
        .text('Select X-Axis variable: ')
    var yInput = body.append('select')
        .attr('id','xSelect')
        .on('change',xChange)
        .selectAll('option')
        .data(selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text ;})
    body.append('br')

    // Select Y-axis Variable
    var span = body.append('span')
        .text('Select Y-Axis variable: ')
    var yInput = body.append('select')
        .attr('id','ySelect')
        .on('change',yChange)
        .selectAll('option')
        .data(selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text ;})
    body.append('br')

    // Variables
    var body = d3.select('body')
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var h = 500 - margin.top - margin.bottom
    var w = 500 - margin.left - margin.right
    var formatPercent = d3.format('.2%')
    // Scales
    var colorScale = d3.scale.category20()
    var xScale = d3.scale.linear()
        .domain([
            d3.min([0,d3.min(data,function (d) { return d['sepal_width'] })]),
            d3.max([0,d3.max(data,function (d) { return d['sepal_width'] })])
        ])
        .range([0,w])
    var yScale = d3.scale.linear()
        .domain([
            d3.min([0,d3.min(data,function (d) { return d['petal_length'] })]),
            d3.max([0,d3.max(data,function (d) { return d['petal_length'] })])
        ])
        .range([h,0])
    // SVG
    var svg = body.append('svg')
        .attr('height',h + margin.top + margin.bottom)
        .attr('width',w + margin.left + margin.right)
        .append('g')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
    // X-axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(formatPercent)
        .ticks(5)
        .orient('bottom')
    // Y-axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(formatPercent)
        .ticks(5)
        .orient('left')
    // Circles
    var circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx',function (d) { return xScale(d['value']) })
        .attr('cy',function (d) { return yScale(d['value']) })
        .attr('r','5')
        .attr('stroke','black')
        .attr('stroke-width',1)
        .attr('fill',function (d,i) { return colorScale(i) })
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r',20)
                .attr('stroke-width',3)
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r',5)
                .attr('stroke-width',1)
        })
        .append('title') // Tooltip
        .text(function (d) { return d.variable +
            '\nReturn: ' + formatPercent(d['value']) +
            '\nStd. Dev.: ' + formatPercent(d['value']) +
            '\nMax Drawdown: ' + formatPercent(d['value']) })
    // X-axis
    svg.append('g')
        .attr('class','axis')
        .attr('id','xAxis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis)
        .append('text') // X-axis Label
        .attr('id','xAxisLabel')
        .attr('y',-10)
        .attr('x',w)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text('good values')
    // Y-axis
    svg.append('g')
        .attr('class','axis')
        .attr('id','yAxis')
        .call(yAxis)
        .append('text') // y-axis Label
        .attr('id', 'yAxisLabel')
        .attr('transform','rotate(-90)')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text('the coolest values')

    function yChange() {
        var value = this.value // get the new y value
        yScale // change the yScale
            .domain([
                d3.min([0,d3.min(data,function (d) { return d[value] })]),
                d3.max([0,d3.max(data,function (d) { return d[value] })])
            ])
        yAxis.scale(yScale) // change the yScale
        d3.select('#yAxis') // redraw the yAxis
            .transition().duration(10)
            .call(yAxis)
        d3.select('#yAxisLabel') // change the yAxisLabel
            .text(value)
        d3.selectAll('circle') // move the circles
            .transition().duration(10)
            .delay(function (d,i) { return i*100})
            .attr('cy',function (d) { return yScale(d[value]) })
    }

    function xChange() {
        var value = this.value // get the new x value
        xScale // change the xScale
            .domain([
                d3.min([0,d3.min(data,function (d) { return d[value] })]),
                d3.max([0,d3.max(data,function (d) { return d[value] })])
            ])
        xAxis.scale(xScale) // change the xScale
        d3.select('#xAxis') // redraw the xAxis
            .transition().duration(10)
            .call(xAxis)
        d3.select('#xAxisLabel') // change the xAxisLabel
            .transition().duration(10)
            .text(value)
        d3.selectAll('circle') // move the circles
            .transition().duration(10)
            .delay(function (d,i) { return i*10})
            .attr('cx',function (d) { return xScale(d[value]) })
    }
})