let print = console.log

function drawMemory(mem, data, tooltip) {
  const memSize = 1499136;
  print(memSize);

  const scale = (v) => v / 1000;

  mem.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .call(g => { 
        g.attr("transform", (d, i) => `translate(0, ${20 + i * 50 + i * 20})`);
        g.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", scale(memSize))
          .attr("height", 50)
          .attr("stroke", "#888")
          .attr("fill", "#ccc");

        g.append("text")
          .attr("x", 0)
          .attr("y", 0)
          .text((d) => d.message);

        g.append("g")
          .selectAll("rect")
          .data(d => Object.entries(d.state.allocations))
          .join("rect")
          .attr("x", ([a, s]) => scale(Number(a)))
          .attr("y", 0)
          .attr("width", ([a, s]) => scale(s))
          .attr("height", 50)
          .attr("fill", d3.scaleOrdinal(d3.schemeDark2))
          .on("mouseover", function ([a, s]) {
              tooltip.style("visibility", "visible")
                  .html(`<pre>address=${a} size=${s}</pre>`);
          })
          .on("mouseout", function ([a, s]) {
              tooltip.style("visibility", "hidden");
          });
      }
    );
}

function chart(data) {
  console.log(data);
  const container = d3.select("body")
    .append("div")
    .attr("id", "container")
    .style("overflow", "scroll");
    const margin = 5;

  const tooltip = container
    .append("div")
    .style("pointer-events", "none")
    .style("position", "fixed")
    .style("visibility", "hidden")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .style("line-height", "1.6")
    .style("margin", "20px")
    .style("padding", "10px")
    .style("top", "0px")
    .style("left", "20px")
    .style("z-index", "1")
    .style("background-color", "#eee");

  const svg = container.append("svg")
    .attr("transform", d => `translate(${margin}, ${margin})`);

  drawMemory(svg, data, tooltip);

  const bbox = svg.node().getBBox();
  const width = bbox.x + bbox.width;
  const height = bbox.y + bbox.height + 100;
  svg.attr("width", width);
  svg.attr("height", height);
}
