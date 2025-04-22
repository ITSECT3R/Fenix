const dataSetApiUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

document.addEventListener('DOMContentLoaded', () => {
  fetch(dataSetApiUrl)
    .then(response => response.json())
    .then(data => {
      renderHeatMap(data);
    })
    .catch(err => {
      document.getElementById('heatmap-container').innerHTML = '<p style="color:red">Failed to load data.</p>';
      console.error('Error fetching data:', err);
    });
});

function renderHeatMap(data) {
  // Set up SVG dimensions and margins
  const margin = { top: 60, right: 20, bottom: 80, left: 90 };
  const width = 1000 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  const svg = d3.select('#heatmap')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const baseTemp = data.baseTemperature;
  const monthlyData = data.monthlyVariance;

  // X: Years
  const years = monthlyData.map(d => d.year);
  const yearsSet = Array.from(new Set(years));
  const xScale = d3.scaleBand()
    .domain(yearsSet)
    .range([0, width]);

  // Y: Months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const yScale = d3.scaleBand()
    .domain(d3.range(1, 13))
    .range([0, height]);

  // Color scale
  const temps = monthlyData.map(d => baseTemp + d.variance);
  const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRdYlBu)
    .domain([d3.max(temps), d3.min(temps)]);

  // X Axis
  const xAxis = d3.axisBottom(xScale)
    .tickValues(yearsSet.filter(year => year % 10 === 0))
    .tickFormat(d3.format('d'));
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', '10px');

  // Y Axis
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(month => months[month - 1]);
  svg.append('g')
    .attr('id', 'y-axis')
    .call(yAxis)
    .selectAll('text')
    .attr('font-size', '11px');

  // Draw cells
  svg.selectAll('.cell')
    .data(monthlyData)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', d => d.month - 1)
    .attr('data-year', d => d.year)
    .attr('data-temp', d => baseTemp + d.variance)
    .attr('x', d => xScale(d.year))
    .attr('y', d => yScale(d.month))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(baseTemp + d.variance));

  // Tooltip setup
  const tooltip = d3.select('#tooltip');

  svg.selectAll('.cell')
    .on('mouseover', function(event, d) {
      const temp = (baseTemp + d.variance).toFixed(2);
      // Get bounding rect of the SVG container
      const containerRect = document.getElementById('heatmap-container').getBoundingClientRect();
      // Position tooltip relative to the container
      tooltip.style('opacity', 0.95)
        .html(`
          <strong>${d.year} - ${months[d.month - 1]}</strong><br/>
          Temp: ${temp}℃<br/>
          Variance: ${d.variance.toFixed(2)}℃
        `)
        .attr('data-year', d.year)
        .style('left', (event.clientX - containerRect.left + 10) + 'px')
        .style('top', (event.clientY - containerRect.top - 40) + 'px');
      d3.select(this).attr('stroke', '#222').attr('stroke-width', 1);
    })
    .on('mouseout', function() {
      tooltip.style('opacity', 0);
      d3.select(this).attr('stroke', null).attr('stroke-width', null);
    });

  // Legend setup
  const legendWidth = 400;
  const legendHeight = 20;
  const legendColors = 10;
  const legendThresholds = d3.range(
    d3.min(temps),
    d3.max(temps),
    (d3.max(temps) - d3.min(temps)) / legendColors
  );

  const legendScale = d3.scaleLinear()
    .domain([d3.min(temps), d3.max(temps)])
    .range([0, legendWidth]);

  const legendAxis = d3.axisBottom(legendScale)
    .tickValues(legendThresholds.concat(d3.max(temps)))
    .tickFormat(d3.format('.2f'));

  const legendSvg = d3.select('#legend')
    .append('svg')
    .attr('width', legendWidth + 40)
    .attr('height', legendHeight + 40)
    .append('g')
    .attr('transform', 'translate(20,20)');

  legendSvg.selectAll('rect')
    .data(legendThresholds)
    .enter()
    .append('rect')
    .attr('x', d => legendScale(d))
    .attr('y', 0)
    .attr('width', legendWidth / legendColors)
    .attr('height', legendHeight)
    .attr('fill', d => colorScale(d));

  legendSvg.append('g')
    .attr('id', 'legend-axis')
    .attr('transform', `translate(0,${legendHeight})`)
    .call(legendAxis);
}