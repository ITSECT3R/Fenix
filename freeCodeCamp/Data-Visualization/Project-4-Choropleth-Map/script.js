const usEducationDataApi = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const usCountyDataApi = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

Promise.all([
  fetch(usCountyDataApi).then(res => res.json()),
  fetch(usEducationDataApi).then(res => res.json())
]).then(([usCountyData, usEducationData]) => {
  const width = 960;
  const height = 600;

  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'choropleth');

  // Helper: get education data by county id
  const educationByFips = {};
  usEducationData.forEach(d => {
    educationByFips[d.fips] = d;
  });

  // Color scale
  const eduExtent = d3.extent(usEducationData, d => d.bachelorsOrHigher);
  const color = d3.scaleQuantize()
    .domain(eduExtent)
    .range(d3.schemeBlues[9]);

  // Draw counties
  svg.append('g')
    .selectAll('path')
    .data(topojson.feature(usCountyData, usCountyData.objects.counties).features)
    .join('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('data-fips', d => d.id)
    .attr('data-education', d => educationByFips[d.id]?.bachelorsOrHigher)
    .attr('fill', d => {
      const edu = educationByFips[d.id]?.bachelorsOrHigher;
      return edu !== undefined ? color(edu) : '#ccc';
    });

  // Legend (move to top)
  const legendWidth = 300;
  const legendHeight = 10;
  const legendMargin = 40;
  const legendColors = color.range();
  const legendScale = d3.scaleLinear()
    .domain(color.domain())
    .range([0, legendWidth]);

  const legend = svg.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${(width - legendWidth) / 2 + 200},${legendMargin})`);

  legend.selectAll('rect')
    .data(legendColors)
    .join('rect')
    .attr('x', (d, i) => i * legendWidth / legendColors.length)
    .attr('y', 0)
    .attr('width', legendWidth / legendColors.length)
    .attr('height', legendHeight)
    .attr('fill', d => d);

  // Legend axis
  const legendAxis = d3.axisBottom(legendScale)
    .tickValues(color.range().map((d, i, arr) => {
      const domain = color.invertExtent(d);
      return i === arr.length - 1 ? domain[1] : domain[0];
    }))
    .tickFormat(d3.format('.1f'));

  legend.append('g')
    .attr('transform', `translate(0,${legendHeight})`)
    .call(legendAxis);

  // Tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('background', '#fff')
    .style('padding', '8px')
    .style('border', '1px solid #333')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('display', 'none');

  svg.selectAll('.county')
    .on('mouseover', function(event, d) {
      const edu = educationByFips[d.id];
      tooltip.style('display', 'block')
        .transition().duration(100).style('opacity', 0.9);
      tooltip.html(
        `<strong>${edu.area_name}, ${edu.state}</strong><br />`
        + `${edu.bachelorsOrHigher}% with Bachelor or higher`
      )
      .attr('data-education', edu.bachelorsOrHigher)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition().duration(200).style('opacity', 0)
        .on('end', () => tooltip.style('display', 'none'));
    });
});
