// Load CSV data and initialize visualizations
d3.csv("data.csv").then((data) => {
    // 1. Bar Chart - HDI by Country
    createBarChart(data);

    // 2. Line Chart - Life Expectancy across countries
    createLineChart(data);

    // 3. Pie Chart - Income Groups Distribution
    createPieChart(data);

    // 4. Line Chart - Life Expectancy by Income Group
    createLifeExpectancyByIncomeGroupChart(data);

    // 5. Horizontal Bar Chart - Total Ecological Footprint by Country
    createHorizontalBarChart(data);

    // 6. Stacked Bar Chart - Land Footprint by Country
    createStackedBarChart(data);
});

// Function to add chart titles
function addTitle(svg, titleText) {
    svg.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(titleText);
}

// Tooltip setup
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("padding", "8px")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("border-radius", "4px");

// 1. Bar Chart - HDI by Country
function createBarChart(data) {
    const svg = d3.select("#barChart").append("svg").attr("width", 500).attr("height", 300);
    addTitle(svg, "HDI by Country");

    const hdiData = data.map(d => ({ country: d.Country, hdi: +d.HDI }));
    const xScale = d3.scaleBand().domain(hdiData.map(d => d.country)).range([0, 480]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(hdiData, d => d.hdi)]).range([280, 0]);

    svg.append("g").selectAll("rect")
        .data(hdiData).enter().append("rect")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.hdi))
        .attr("width", xScale.bandwidth())
        .attr("height", d => 280 - yScale(d.hdi))
        .attr("fill", "teal")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible").text(`Country: ${d.country}, HDI: ${d.hdi}`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    svg.append("g").attr("transform", "translate(0,280)").call(d3.axisBottom(xScale).tickFormat(d => d.substring(0, 3)));
    svg.append("g").call(d3.axisLeft(yScale));
}

// 2. Line Chart - Life Expectancy by Country
function createLineChart(data) {
    const svg = d3.select("#lineChart").append("svg").attr("width", 500).attr("height", 300);
    addTitle(svg, "Life Expectancy by Country");

    const lifeData = data.map(d => ({ country: d.Country, lifeExpectancy: +d['Life Exectancy'] }));
    const xScale = d3.scaleBand().domain(lifeData.map(d => d.country)).range([0, 480]);
    const yScale = d3.scaleLinear().domain([0, d3.max(lifeData, d => d.lifeExpectancy)]).range([280, 0]);

    const line = d3.line()
        .x(d => xScale(d.country) + xScale.bandwidth() / 2)
        .y(d => yScale(d.lifeExpectancy));

    svg.append("path")
        .datum(lifeData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("g").attr("transform", "translate(0,280)").call(d3.axisBottom(xScale).tickFormat(d => d.substring(0, 3)));
    svg.append("g").call(d3.axisLeft(yScale));
}

// 3. Pie Chart - Income Group Distribution
function createPieChart(data) {
    const svg = d3.select("#pieChart").append("svg").attr("width", 300).attr("height", 300);
    addTitle(svg, "Income Group Distribution");

    const incomeGroups = d3.rollups(data, v => v.length, d => d['Income Group']);
    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(140);

    svg.append("g").attr("transform", "translate(150,150)")
        .selectAll("path")
        .data(pie(incomeGroups)).enter().append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible").text(`${d.data[0]}: ${d.data[1]}`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
}

// 4. Line Chart - Life Expectancy by Income Group
function createLifeExpectancyByIncomeGroupChart(data) {
    const svg = d3.select("#scatterPlot").append("svg").attr("width", 500).attr("height", 300);
    addTitle(svg, "Life Expectancy by Income Group");

    const avgLifeByIncome = d3.rollups(data, v => d3.mean(v, d => +d['Life Exectancy']), d => d['Income Group']);
    const xScale = d3.scaleBand().domain(avgLifeByIncome.map(d => d[0])).range([0, 480]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(avgLifeByIncome, d => d[1])]).range([280, 0]);

    const line = d3.line()
        .x(d => xScale(d[0]) + xScale.bandwidth() / 2)
        .y(d => yScale(d[1]));

    svg.append("path")
        .datum(avgLifeByIncome)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible").text(`Income Group: ${d[0]}, Life Expectancy: ${d[1].toFixed(2)}`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    svg.append("g").attr("transform", "translate(0,280)").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));
}

// 5. Horizontal Bar Chart - Total Ecological Footprint by Country
function createHorizontalBarChart(data) {
    const svg = d3.select("#mapVisualization").append("svg").attr("width", 500).attr("height", 300);
    addTitle(svg, "Total Ecological Footprint by Country");

    const footprintData = data.map(d => ({ country: d.Country, footprint: +d['Total Ecological Footprint (Consumption)'] }));
    const yScale = d3.scaleBand().domain(footprintData.map(d => d.country)).range([0, 280]).padding(0.2);
    const xScale = d3.scaleLinear().domain([0, d3.max(footprintData, d => d.footprint)]).range([0, 480]);

    svg.append("g").selectAll("rect")
        .data(footprintData).enter().append("rect")
        .attr("y", d => yScale(d.country))
        .attr("x", 0)
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.footprint))
        .attr("fill", "orange")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible").text(`Country: ${d.country}, Footprint: ${d.footprint}`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    svg.append("g").attr("transform", "translate(0,280)").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));
}

// 6. Stacked Bar Chart - Land Footprint by Country
function createStackedBarChart(data) {
    const svg = d3.select("#stackedBarChart").append("svg").attr("width", 500).attr("height", 300);
    addTitle(svg, "Land Footprint by Country");

    const keys = ["Cropland Footprint", "Grazing Footprint", "Forest Product Footprint"];
    const stackedData = d3.stack().keys(keys)(data);

    const xScale = d3.scaleBand().domain(data.map(d => d.Country)).range([0, 480]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).range([280, 0]);

    svg.append("g").selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => xScale(d.data.Country))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible").text(`Country: ${d.data.Country}, Value: ${d[1] - d[0]}`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    svg.append("g").attr("transform", "translate(0,280)").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));
}
