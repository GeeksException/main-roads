var width = 960,
    height = 500

var svg = d3.select("div#firstPrototype").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height])
	.on("tick", tick);

var nodes = [], links = [], root;
var link = svg.selectAll(".link"),
	node = svg.selectAll(".node");

var currentSelection;

d3.json("graph.json", function(error, json) {
	d3.select("div#jsonData").html("<pre>" + JSON.stringify(json, undefined, 2) + "</pre>");
	nodes = root = json;
	update();
});

function update() {
	nodes = flatten(nodes);
	links = d3.layout.tree().links(nodes);
	
	svg.selectAll("text").remove();
	
	force
		.nodes(nodes)
		.links(links)
		.start();
	
	link = link.data(links, function(d) { return d.target.id; });
	link.exit().remove();	
	link = link.data(links);
	link.enter().insert("line", ".node")
		.attr("class", "link");
	
	node = node.data(nodes, function(d) { return d.id; });
	node.exit().remove();
	node = node.data(nodes);
	node.enter().append("g")
		.attr("class", "node")
		.on("click", click)
		.call(force.drag);
	node.append("circle")
		.attr("r", function(d) {
			return d.population;
		});
	node.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.name });
}

function click(target) {
	if (d3.event.defaultPrevented) return; // ignore drag
	
	var straightLineDiagram = d3.select("div#straightLineDiagram");
	straightLineDiagram.append("span").attr("class", "glyphicon glyphicon-chevron-right");
	straightLineDiagram.append("span").text(" " + target.name + " ");
	
	if (target.children) {
		target._children = target.children;
		target.children = null;
	} else {
		target.children = target._children;
		target._children = null;
		
		if(target.name !== root.name) {
			target.children.push(root);
		}
	}
	
	nodes = hideGrandChildren(target);
	update();
}

function hideGrandChildren(root) {
	root.children.forEach(function (child) {
		if (child.children) {
			child._children = child.children;
			child.children = null;
		}
	});
	
	return root;
}

function tick() {
	link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
	
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	nodes[nodes.length - 1].x = width / 2;
	nodes[nodes.length - 1].y = height / 2;
}

function flatten(root) {
	var flattenNodes = [], i = 0;
	
	function recurse(node) {
		if (node.children) node.children.forEach(recurse);
		if (!node.id) node.id = ++i;
			flattenNodes.push(node);
	}
	
	recurse(root);
	
	return flattenNodes;
}