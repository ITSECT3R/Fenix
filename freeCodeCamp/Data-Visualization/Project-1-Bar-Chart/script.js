// Chart container and tooltip
const container = document.createElement('div');
container.id = 'chart-container';
document.body.prepend(container);

const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
document.body.appendChild(tooltip);

// Fetch GDP data and draw chart
const DATA_URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => drawChart(data.data));

function drawChart(dataset) {
  const w = 800;
  const h = 500;
  const padding = 60;

  const svg = d3.select('#chart-container')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const xScale = d3.scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([h - padding, padding]);

  // X Axis
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${h - padding})`)
    .call(d3.axisBottom(xScale));

  // Y Axis
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding},0)`)
    .call(d3.axisLeft(yScale));

  // Bars
  svg.selectAll('.bar')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr('x', d => xScale(new Date(d[0])))
    .attr('y', d => yScale(d[1]))
    .attr('width', (w - 2 * padding) / dataset.length)
    .attr('height', d => h - padding - yScale(d[1]))
    .on('mouseover', function(event, d) {
      tooltip.style.opacity = 1;
      tooltip.innerHTML = `<strong>Date:</strong> ${d[0]}<br><strong>GDP:</strong> $${d[1].toLocaleString()} Billion`;
      tooltip.setAttribute('data-date', d[0]);
      tooltip.style.left = (event.pageX + 10) + 'px';
      tooltip.style.top = (event.pageY - 40) + 'px';
    })
    .on('mouseout', function() {
      tooltip.style.opacity = 0;
    });

  // Chart title
  svg.append('text')
    .attr('id', 'title')
    .attr('x', w / 2)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '28px')
    .text('United States GDP');
}