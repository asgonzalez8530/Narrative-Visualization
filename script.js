// window size
var width = 1200;
var height = 800;
var margin = 100;

var graph = d3.select('#fuel-graph');

// graph scale
var x = d3.scaleLog([10, 150], [0, width]).base(2);
var y = d3.scaleLog([10, 150], [height,0]).base(10);

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


var currentSlide = 1; // TODO: revert back to slide zero

async function loadSlide()
{
    hideSlideButtons();
    clearSideBarContent();
    drawGraph();
    switch (currentSlide)
    {
        default:
        case 0:
            currentSlide = 0;
            // await drawTitlePageGraph();
            loadTitlePage();
            return;
        case 1:
            // await drawSceneOneGraph();
            await loadSceneOne();
            break;
        case 2: 
            // await drawSceneTwoGraph();
            await loadSceneTwo();
            break;
        case 3: 
            // await drawSceneThreeGraph();
            await loadSceneThree();
            break;
        case 4:
            // await drawConclusionGraph();
            await loadConclusion();
            return;
    }
    showSlideButtons();
}

async function drawGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

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

async function drawTitlePageGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

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

function loadTitlePage()
{
    document.getElementById('sidebar-title').textContent = 'Introduction'; 
    document.getElementById('sidebar-narrative').textContent = 'Let\'s explore how different fuel types and engine sizes affect city and highway miles per gallon (MPG).';
    
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

function clearSideBarContent()
{
    var title = document.getElementById('sidebar-title');
    var narrative = document.getElementById('sidebar-narrative');
    
    title.textContent = ''; 
    narrative.textContent = '';

    d3.select(".annotations").remove();
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

async function type(element, text)
{
    for (let charIndex = 0; charIndex < text.length; charIndex++) 
    {
        element.textContent += text.charAt(charIndex);
        await new Promise(r => setTimeout(r, 10)); // wait 2 ms
    }
}

async function drawSceneOneGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

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

async function loadSceneOne()
{
    var title = document.getElementById('sidebar-title');
    var narrative = document.getElementById('sidebar-narrative');
    
    title.textContent = 'Fuel Type and MPG Relationship'; 
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds

    await electricCarsAnnotations();
    
    var text = "Fuel type is a significant factor in determining fuel efficiency, with electric vehicles generally "
        + "performing better in the city due to regenerative braking, while diesel vehicles tend to perform better than gasoline "
        + "vehicles on the highway.";
    
    await type(narrative, text);
}

async function electricCarsAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Electric Vehicles",
            label: "High preforms in City and Highway MPG",
            wrap: 190
        },
        subject: {
            radius: 170
        },
        x: 1175,
        y: 220,
        dy: 170,
        dx: -170
    }].map(function(d){ d.color = "#5f5fa7"; return d});

    const makeAnnotations = d3.annotation()
        .notePadding(10)
        .type(type)
        .annotations(annotations);

    graph.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

async function drawSceneTwoGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

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

async function loadSceneTwo()
{
    var title = document.getElementById('sidebar-title');
    var narrative = document.getElementById('sidebar-narrative');

    title.textContent = 'Engine Size Impact'; 
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var text = "Fuel type ...";
    
    await type(narrative, text);
}

async function drawSceneThreeGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

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

async function loadSceneThree()
{
    var title = document.getElementById('sidebar-title');
    var narrative = document.getElementById('sidebar-narrative');

    title.textContent = 'Combining the Effect of Fuel Type and Engine Size'; 
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var text = "Fuel type ...";
    
    await type(narrative, text);
}

async function drawConclusionGraph()
{
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

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

async function loadConclusion()
{
    var title = document.getElementById('sidebar-title');
    var narrative = document.getElementById('sidebar-narrative');

    title.textContent = 'Conclusion'; 
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    var text = "Fuel type ...";
    
    await type(narrative, text);

    var backButton = document.getElementById('back-button');
    backButton.style.visibility = 'visible';
    backButton.textContent = '\u2190 Back';
    var nextButton = document.getElementById('next-button');
    nextButton.style.visibility = 'visible';
    nextButton.textContent = 'Restart';
}