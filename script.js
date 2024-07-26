var currentSlide = 0;

async function init() 
{
    currentSlide = 0;
    await drawTitlePageGraph();
    loadTitlePageContent();
}

async function drawTitlePageGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var width = 1200;
    var height = 800;
    var margin = 100;

    var x = d3.scaleLog([10, 150], [0, width]).base(2);
    var y = d3.scaleLog([10, 150], [height,0]).base(10);

    var graph = d3.select('#fuel-graph');

    // setup y axis
    var yAxis = d3.axisLeft(y)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .call(yAxis);

    graph.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin/2)
    .attr("x", -1 * (height/2))
    .attr("transform", "rotate(-90)")
    .text("Average Highway MPG");
    
    // setup x axis
    var xAxis = d3.axisBottom(x)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+(height+margin)+")")
    .call(xAxis);

    graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin*2)
    .attr("y", height + margin + margin/2)
    .text("Average City MPG");
    
    // draw graph
    graph.attr("width",width + 2*margin)
    .attr("height",height + 2*margin)
    .append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .selectAll()
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.AverageCityMPG))
    .attr('cy', (d) => y(d.AverageHighwayMPG))
    .attr('r',  (d) => parseInt(d.EngineCylinders) + 8)
    .attr('fill', (d) => fuelTypeColor(d));
}

function loadTitlePageContent()
{
    document.getElementById('sidebar-title').textContent = 'Introduction'; 
    document.getElementById('sidebar-focus').textContent = 'Let\'s explore how different fuel types and engine sizes affect city and highway miles per gallon (MPG).';
    document.getElementById('sidebar-conclusion').textContent = "";
    
    var backButton = document.getElementById('back-button');
    backButton.style.visibility = 'hidden';

    var nextButton = document.getElementById('next-button');
    nextButton.textContent = 'Let\'s Explore \u2192';
    nextButton.style.visibility = 'visible';
}

function fuelTypeColor(data)
{
    switch (data.Fuel)
    {
        case "Gasoline":
            return '#305cde'; // blue
        case "Electricity":
            return '#45a049'; // green
        case "Diesel":
            return '#c91b00'; // red
    }
}

async function nextSlide()
{
    currentSlide++;
    await loadSlide();
}

async function previousSlide()
{
    currentSlide--;
    await loadSlide();
}

async function loadSlide()
{
    hideSlideButtons();
    clearSideBarContent();
    switch (currentSlide)
    {
        default:
        case 0:
            await init();
            return;
        case 1:
            await drawSceneOneGraph();
            await loadSceneOneContent();
            break;
        case 2: 
            await drawSceneTwoGraph();
            await loadSceneTwoContent();
            break;
        case 3: 
            await drawSceneThreeGraph();
            await loadSceneThreeContent();
            break;
        case 4:
            await drawConclusionGraph();
            await loadConclusionContent();
            return;
    }
    showSlideButtons();
}

function clearSideBarContent()
{
    var title = document.getElementById('sidebar-title');
    title.textContent = ''; 

    var focus = document.getElementById('sidebar-focus');
    focus.textContent = '';
    
    var conclusion = document.getElementById('sidebar-conclusion');
    conclusion.textContent = '';
}

function hideSlideButtons()
{
    var backButton = document.getElementById('back-button');
    backButton.style.visibility = 'hidden';

    var nextButton = document.getElementById('next-button');
    nextButton.style.visibility = 'hidden';
}

function showSlideButtons()
{
    var backButton = document.getElementById('back-button');
    backButton.style.visibility = 'visible';
    backButton.textContent = '\u2190 Back';
    var nextButton = document.getElementById('next-button');
    nextButton.style.visibility = 'visible';
    nextButton.textContent = 'Next \u2192';
}

async function drawSceneOneGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var width = 1200;
    var height = 800;
    var margin = 100;

    var x = d3.scaleLog([10, 150], [0, width]).base(2);
    var y = d3.scaleLog([10, 150], [height,0]).base(10);

    var graph = d3.select('#fuel-graph');

    // setup y axis
    var yAxis = d3.axisLeft(y)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .call(yAxis);

    graph.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin/2)
    .attr("x", -1 * (height/2))
    .attr("transform", "rotate(-90)")
    .text("Average Highway MPG");
    
    // setup x axis
    var xAxis = d3.axisBottom(x)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+(height+margin)+")")
    .call(xAxis);

    graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin*2)
    .attr("y", height + margin + margin/2)
    .text("Average City MPG");
    
    // draw graph
    graph.attr("width",width + 2*margin)
    .attr("height",height + 2*margin)
    .append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .selectAll()
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.AverageCityMPG))
    .attr('cy', (d) => y(d.AverageHighwayMPG))
    .attr('r',  (d) => parseInt(d.EngineCylinders) + 8)
    .attr('fill', 'black');
}

async function loadSceneOneContent()
{
    var title = document.getElementById('sidebar-title');
    title.textContent = 'Fuel Type and MPG Relationship'; 

    var focus = document.getElementById('sidebar-focus');
    focus.textContent = 'How does fuel type impact average highway and city MPG?';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var conclusion = document.getElementById('sidebar-conclusion');
    var text = "Fuel type is a significant factor in determining fuel efficiency, with electric vehicles generally "
        + "performing better in the city due to regenerative braking, while diesel vehicles tend to perform better than gasoline "
        + "vehicles on the highway.";
    
    await type(conclusion, text);
}

async function type(element, text)
{
    for (let charIndex = 0; charIndex < text.length; charIndex++) 
    {
        element.textContent += text.charAt(charIndex);
        await new Promise(r => setTimeout(r, 20)); // wait 2 ms
    }
}

async function drawSceneTwoGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var width = 1200;
    var height = 800;
    var margin = 100;

    var x = d3.scaleLog([10, 150], [0, width]).base(2);
    var y = d3.scaleLog([10, 150], [height,0]).base(10);

    var graph = d3.select('#fuel-graph');

    // setup y axis
    var yAxis = d3.axisLeft(y)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .call(yAxis);

    graph.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin/2)
    .attr("x", -1 * (height/2))
    .attr("transform", "rotate(-90)")
    .text("Average Highway MPG");
    
    // setup x axis
    var xAxis = d3.axisBottom(x)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+(height+margin)+")")
    .call(xAxis);

    graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin*2)
    .attr("y", height + margin + margin/2)
    .text("Average City MPG");
    
    // draw graph
    graph.attr("width",width + 2*margin)
    .attr("height",height + 2*margin)
    .append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .selectAll()
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.AverageCityMPG))
    .attr('cy', (d) => y(d.AverageHighwayMPG))
    .attr('r',  (d) => parseInt(d.EngineCylinders) + 8)
    .attr('fill', 'black');
}

async function loadSceneTwoContent()
{
    var title = document.getElementById('sidebar-title');
    title.textContent = 'Engine Size Impact'; 

    var focus = document.getElementById('sidebar-focus');
    focus.textContent = 'How does fuel type impact average highway and city MPG?';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var conclusion = document.getElementById('sidebar-conclusion');
    var text = "Fuel type ...";
    
    await type(conclusion, text);
}

async function drawSceneThreeGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var width = 1200;
    var height = 800;
    var margin = 100;

    var x = d3.scaleLog([10, 150], [0, width]).base(2);
    var y = d3.scaleLog([10, 150], [height,0]).base(10);

    var graph = d3.select('#fuel-graph');

    // setup y axis
    var yAxis = d3.axisLeft(y)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .call(yAxis);

    graph.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin/2)
    .attr("x", -1 * (height/2))
    .attr("transform", "rotate(-90)")
    .text("Average Highway MPG");
    
    // setup x axis
    var xAxis = d3.axisBottom(x)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+(height+margin)+")")
    .call(xAxis);

    graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin*2)
    .attr("y", height + margin + margin/2)
    .text("Average City MPG");
    
    // draw graph
    graph.attr("width",width + 2*margin)
    .attr("height",height + 2*margin)
    .append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .selectAll()
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.AverageCityMPG))
    .attr('cy', (d) => y(d.AverageHighwayMPG))
    .attr('r',  (d) => parseInt(d.EngineCylinders) + 8)
    .attr('fill', 'black');
}

async function loadSceneThreeContent()
{
    var title = document.getElementById('sidebar-title');
    title.textContent = 'Combining the Effect of Fuel Type and Engine Size'; 

    var focus = document.getElementById('sidebar-focus');
    focus.textContent = 'How does fuel type impact average highway and city MPG?';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var conclusion = document.getElementById('sidebar-conclusion');
    var text = "Fuel type ...";
    
    await type(conclusion, text);
}

async function drawConclusionGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var width = 1200;
    var height = 800;
    var margin = 100;

    var x = d3.scaleLog([10, 150], [0, width]).base(2);
    var y = d3.scaleLog([10, 150], [height,0]).base(10);

    var graph = d3.select('#fuel-graph');

    // setup y axis
    var yAxis = d3.axisLeft(y)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .call(yAxis);

    graph.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin/2)
    .attr("x", -1 * (height/2))
    .attr("transform", "rotate(-90)")
    .text("Average Highway MPG");
    
    // setup x axis
    var xAxis = d3.axisBottom(x)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"));

    graph.append("g")
    .attr("transform","translate("+margin+","+(height+margin)+")")
    .call(xAxis);

    graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin*2)
    .attr("y", height + margin + margin/2)
    .text("Average City MPG");
    
    // draw graph
    graph.attr("width",width + 2*margin)
    .attr("height",height + 2*margin)
    .append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .selectAll()
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.AverageCityMPG))
    .attr('cy', (d) => y(d.AverageHighwayMPG))
    .attr('r',  (d) => parseInt(d.EngineCylinders) + 8)
    .attr('fill', 'black');
}

async function loadConclusionContent()
{
    var title = document.getElementById('sidebar-title');
    title.textContent = 'Conclusion'; 

    var focus = document.getElementById('sidebar-focus');
    focus.textContent = 'How does fuel type impact average highway and city MPG?';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var conclusion = document.getElementById('sidebar-conclusion');
    var text = "Fuel type ...";
    
    await type(conclusion, text);

    var backButton = document.getElementById('back-button');
    backButton.style.visibility = 'visible';
    backButton.textContent = '\u2190 Back';
    var nextButton = document.getElementById('next-button');
    nextButton.style.visibility = 'visible';
    nextButton.textContent = 'Restart';
}