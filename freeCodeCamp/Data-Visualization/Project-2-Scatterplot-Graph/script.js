const width = 900;
const height = 600;
const padding = 60;

const svg = d3.select('#scatterplot-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Tooltip div (hidden by default)
const tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('background', '#fff')
  .style('border', '1px solid #333')
  .style('padding', '8px')
  .style('pointer-events', 'none');

const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
d3.json(dataUrl).then(dataset => {
  // Parse time strings into Date objects for y-axis
  const parseTime = d3.timeParse('%M:%S');
  dataset.forEach(d => {
    d.ParsedTime = parseTime(d.Time);
  });

  // X scale: Years
  const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.Year) - 1, d3.max(dataset, d => d.Year) + 1])
    .range([padding, width - padding]);

  // Y scale: Time (minutes:seconds)
  const yScale = d3.scaleTime()
    .domain(d3.extent(dataset, d => d.ParsedTime))
    .range([padding, height - padding]);

  // X Axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${height - padding})`)
    .call(xAxis);

  // Y Axis
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding},0)`)
    .call(yAxis);

  // Circles for each cyclist
  svg.selectAll('.dot')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => d.ParsedTime.toISOString())
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(d.ParsedTime))
    .attr('r', 6)
    .attr('fill', d => d.Doping ? '#d62728' : '#1f77b4')
    .on('mouseover', function(event, d) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(
        `<strong>${d.Name}</strong>: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${d.Time}` +
        (d.Doping ? `<br/><br/>${d.Doping}` : '')
      )
      .attr('data-year', d.Year)
      .style('left', (event.pageX + 15) + 'px')
      .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition().duration(200).style('opacity', 0);
    });

  // Legend
  const legendWidth = 220;
  const legendX = width - padding - legendWidth + 30;
  const legendY = padding;
  const legend = svg.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${legendX},${legendY})`);

  // Legend: No doping
  legend.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 7)
    .attr('fill', '#1f77b4');
  legend.append('text')
    .attr('x', 20)
    .attr('y', 5)
    .text('No doping allegations')
    .style('font-size', '1em')
    .attr('alignment-baseline', 'middle');

  // Legend: Doping
  legend.append('circle')
    .attr('cx', 0)
    .attr('cy', 30)
    .attr('r', 7)
    .attr('fill', '#d62728');
  legend.append('text')
    .attr('x', 20)
    .attr('y', 35)
    .text('Riders with doping allegations')
    .style('font-size', '1em')
    .attr('alignment-baseline', 'middle');
});