const kickStarterApi = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
const movieSalesApi = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
const videoGameApi = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

document.addEventListener('DOMContentLoaded', function() {
  const apiMap = {
    videoGameApi: {
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
      title: 'Video Game Sales Treemap',
      description: 'Top 100 Most Sold Video Games Grouped by Platform'
    },
    movieSalesApi: {
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
      title: 'Movie Sales Treemap',
      description: 'Top Movies Grouped by Genre'
    },
    kickStarterApi: {
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
      title: 'Kickstarter Pledges Treemap',
      description: 'Top Kickstarter Campaigns Grouped by Category'
    }
  };

  function renderTreemap(apiKey) {
    const { url, title, description } = apiMap[apiKey];
    d3.json(url).then(data => {
      d3.select('#title').text(title);
      d3.select('#description').text(description);
      d3.select('#treemap').selectAll('*').remove();
      d3.select('#legend').selectAll('*').remove();

      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      d3.treemap()
        .size([1000, 600])
        .paddingInner(1)
        (root);

      const svg = d3.select('#treemap');
      const fader = color => d3.interpolateRgb(color, '#fff')(0.2);
      const color = d3.scaleOrdinal()
        .domain(data.children.map(d => d.name))
        .range(d3.schemeCategory10.map(fader));

      const leaves = root.leaves();
      const cell = svg.selectAll('g')
        .data(leaves)
        .enter().append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      cell.append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.category));

      cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 15 + i * 12)
        .text(d => d);

      // Tooltip interactivity
      const tooltip = d3.select('#tooltip');
      cell.on('mousemove', function(event, d) {
        tooltip.style('opacity', 0.9)
          .html(
            `<strong>Name:</strong> ${d.data.name}<br/>
             <strong>Category:</strong> ${d.data.category}<br/>
             <strong>Value:</strong> ${d.data.value}`
          )
          .attr('data-value', d.data.value)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });

      // Legend
      const categories = data.children.map(d => d.name);
      const legend = d3.select('#legend');
      const legendItemSize = 20;
      const legendSpacing = 5;
      const legendItems = legend.selectAll('.legend-item')
        .data(categories)
        .enter().append('div')
        .attr('class', 'legend-item')
        .style('display', 'inline-block')
        .style('margin-right', '15px');
      legendItems.append('span')
        .attr('class', 'legend-color')
        .style('display', 'inline-block')
        .style('width', legendItemSize + 'px')
        .style('height', legendItemSize + 'px')
        .style('background-color', d => color(d))
        .style('margin-right', legendSpacing + 'px');
      legendItems.append('span')
        .attr('class', 'legend-label')
        .text(d => d);
    });
  }

  // Navigation event listeners
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      renderTreemap(this.getAttribute('data-api'));
    });
  });

  // Initial render
  renderTreemap('videoGameApi');
});


