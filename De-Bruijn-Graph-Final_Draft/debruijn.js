// A function to split the sequence k kmers (k is input from Customer)
function build_k_mer(k, reads) {
    var kmers = [];



    for (i = 0; i < reads.length; i++) {
        for (j = 0; j < reads[i].length - k + 1; ++j) {
            let kmer = reads[i].substring(j, j + k);
            kmers.push(kmer);
        }
    }

    return kmers;
}



// A function to to make a graph using dictionary
function makeGraph(k, reads) {
    var kmers = build_k_mer(k, reads); //get the kmers
    var graph = {}; // Dictionary

    for (let i = 0; i < kmers.length; i++) {
        //split k-1 mers 
        let left = kmers[i].substring(0, kmers[i].length - 1); //prefix
        let right = kmers[i].substring(1, kmers[i].length); //suffix

        if (left in graph) {
            graph[left].push(right); //we append the right(value) to the key if left is present
        } else {
            graph[left] = [right]; //key=value if left not in  graph
        }

        if (!(right in graph)) {
            graph[right] = [];
        }
    }
    return graph; //we return the Graph
    //Our graph when read is AAABBBA and k 3
    //AA:AA,AB
    // AB:BB
    // BB:BB,BA
    // BA:
}
//Our complex graph  incorporate arrows, adds labels to edges, and changes foreground and background colors and shapes
//The goal of this function is store data of edges and nodes so we can visualize them using viz.Network 
function For_NetworkData(graph) {
    //We initialize the lists for storing data of edges and nodes 
    var nodesData = []; // Array of object node
    var edgesData = []; // Array of object edges
    // Array of objects: It stores multiple values in a single variable.Here we store the label,shape,font,color of the nodes/edges 

    var keys = Object.keys(graph); // get array of keys of the graph Dictionary
    var edges = {};
    //Here we customise the shape ,label,shape,font,color of the nodes
    for (let key in graph) {
        //properties of nodes
        nodesData.push({
            id: nodesData.length,
            label: key,
            shape: 'oval',
            color: '#000000',
            font: {
                color: 'white'

            }
        });
        //The forEach() method calls a function for each element in an array
        graph[key].forEach(function(value_of_key) {
            let e = key[0] + value_of_key; //concatenate two nodes values inorder to represent the edge relationship
            //ex A:AA:AAA
            //counter for edges
            if (e in edges) {
                edges[e].count++;
            }
            //indexof->Returns the index of the first occurrence of a value in an array
            //if it is new edge ,count is initialized to 1 and starting and destination node is initialized
            else {
                edges[e] = {
                    from: keys.indexOf(key), //start node
                    to: keys.indexOf(value_of_key), //destination node
                    count: 1
                };
            }
        });
    }
    //Here we customise the shape ,label,shape,font,color of the edges
    for (let key in edges) {
        //properties of edges
        edgesData.push({
            from: edges[key].from, //start node
            to: edges[key].to, //destination node
            arrows: 'to', //direction of arrow ->
            label: key + "(" + String(edges[key].count) + ")", //label (key plus count )
            font: {
                align: 'bottom', // label  is present at  bottom of the edge
            }
        });
    }

    return { //array of objects containing dat for viz.Network
        nodes: nodesData,
        edges: edgesData
    };
}

function visualizeNetwork(For_NetworkData) {
    // create a network
    var container = document.getElementById('mynetwork'); //html canvas
    //workspace

    // provide the data in the vis format
    //data stored in dict
    var data = {
        nodes: new vis.DataSet(For_NetworkData

            .nodes), //	Handles the creation and deletion of nodes and contains the global node options and styles.
        edges: new vis.DataSet(For_NetworkData

            .edges), //Handles the creation and deletion of edges and contains the global edge options and styles.
    };
    //The data is collected via arrays of objects along with a configuration object (options) that controls the output.
    var options = {};
    // About Viz
    //   Viz is   A dynamic, browser based visualization library.
    // The library is designed to be easy to use, to handle large amounts of dynamic data, and to enable manipulation of and interaction with the data.
    // The library consists of the components DataSet, Timeline, Network, Graph2d and Graph3d

    //initialize our  network!
    var network = new vis.Network(container, data, options);
    //About vis.Network
    //Network is a visualization to display networks and networks consisting of nodes and edges. The visualization is easy to use and supports custom shapes, styles, colors, sizes, images, and more. The network visualization works smooth on any modern browser for up to a few thousand nodes and edges.
    // To handle a larger amount of nodes, Network has clustering support. 
    //Network uses HTML canvas for rendering.
}
//The main objective of this function is to find length of the read
//Also the code works only if kmers is size is equal to less than read length
// if our input size of kmer is bigger than read length ,we return too big Kmer Size
function readsMin(reads) {
    return reads.reduce(function(p, v) {
        return (p.length < v.length ? p : v);
    });
    //p is the accumulator and v is the current element
    //if the length of accum is > than current then acc is returned else the current one
}
//The reduce() method executes a reducer function for array element.