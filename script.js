// window size
var width = 1200
var height = 800
var margin = 100

var graph = d3.select('#fuel-graph')

// graph scale
var x = d3.scaleLog([10, 150], [0, width]).base(2)
var y = d3.scaleLog([10, 150], [height,0]).base(10)

// setup y axis
var yAxis = d3.axisLeft(y)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"))

graph.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .call(yAxis)

graph.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin/2)
    .attr("x", -1 * (height/2))
    .attr("transform", "rotate(-90)")
    .text("Average Highway MPG")

// setup x axis
var xAxis = d3.axisBottom(x)
    .tickValues([10, 20, 50, 100])
    .tickFormat(d3.format("~s"))

graph.append("g")
    .attr("transform","translate("+margin+","+(height+margin)+")")
    .call(xAxis)

graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin*2)
    .attr("y", height + margin + margin/2)
    .text("Average City MPG")

// legend
var keys = ["Electric", "Gasoline", "Diesel"]
var xLegend = 1250
var yLegend = 750

// legend outline
var rectangle = graph.append("rect")
    .attr('id', 'legend-box')
    .attr("x", xLegend - 20)
    .attr("y", yLegend - 20)
    .attr("width", 135)
    .attr("height", 87)
    .style("fill", "none")
    .style("stroke", "#5f5fa7")
    .style("stroke-width", "2px")
    .attr("rx", 3)

// colors
graph.selectAll()
    .data(keys)
    .enter()
    .append("circle")
        .attr("cx", xLegend)
        .attr("cy", (d, i) => yLegend + i * 25) 
        .attr("r", 7)
        .style("fill", (d) => fuelTypeColor(d))

// labels
graph.selectAll()
    .data(keys)
    .enter()
    .append("text")
        .attr('id', 'legend-options')
        .attr("x", xLegend + 20)
        .attr("y", (d, i) => yLegend + i * 25) 
        .style("fill", (d) => fuelTypeColor(d))
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style('font-size', '20')
        .style('font-weight', 'bold')

// presentation location
var currentSlide = 0

// common html elements
var title = document.getElementById('sidebar-title')
var narrative = document.getElementById('sidebar-narrative')
var conclusionHeader = document.getElementById('sidebar-conclusion-header')
var conclusionText = document.getElementById('sidebar-conclusion')
var backButton = document.getElementById('back-button')
var replayButton = document.getElementById('replay-button')
var nextButton = document.getElementById('next-button')

var leftArrow = '\u2190'
var rightArrow = '\u2192'

backButton.textContent = leftArrow 
replayButton.textContent = 'Replay Scene';

var sceneQuestion = ''

async function init()
{
    await drawGraph()
    loadSlide()
}

async function loadSlide()
{
    resetPage()
    switch (currentSlide)
    {
        default:
        case 0:
            currentSlide = 0
            loadTitlePage()
            return
        case 1:
            await loadSceneOne()
            return
        case 2: 
            await loadSceneTwo()
            return
        case 3: 
            await loadSceneThree()
            return
        case 4:
            await loadConclusion()
            return
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

function resetPage()
{
    title.textContent = ''
    narrative.textContent = ''
    conclusionHeader.textContent = ''
    conclusionText.textContent = ''

    sceneQuestion = ''

    backButton.style.visibility = 'hidden'
    replayButton.style.visibility = 'hidden'
    nextButton.style.visibility = 'hidden'

    document.getElementById("list").innerHTML = '';

    d3.selectAll(".annotations").remove()

    d3.selectAll('#legend-box')
        .style("opacity", 0)
    
    d3.selectAll('#legend-options')
        .style("cursor", "default")
        .on('click', null)

    graph.selectAll('#d-circle')
        .on("mouseover", null)
        .on("mousemove", null)
        .on("mouseleave", null)

    resetGraph()
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
    .attr('city', (d) => d.AverageCityMPG)
    .attr('highway', (d) => d.AverageHighwayMPG)
    .attr('size', (d) => d.EngineCylinders)
    .attr('cy', (d) => y(d.AverageHighwayMPG))
    .attr('r',  (d) => parseInt(d.EngineCylinders) + 8)
    .attr('fill', (d) => fuelTypeColor(d.Fuel))
    .attr('id', 'd-circle')
    .style('opacity', 0)
}

function fuelTypeColor(fuelType)
{
    switch (fuelType)
    {
        case "Gasoline":
            return '#305cde'; // blue
        case "Electricity":
        case "Electric":
            return '#45a049'; // green
        case "Diesel":
            return '#c91b00'; // red
    }
}

function resetGraph()
{
    d3.selectAll('#d-circle')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style('opacity', 1);
}

function showSlideButtons()
{
    nextButton.textContent = rightArrow 

    backButton.style.visibility = 'visible';
    replayButton.style.visibility = 'visible';
    nextButton.style.visibility = 'visible';
}

async function typewriterEffect(element, text)
{
    for (let charIndex = 0; charIndex < text.length; charIndex++) 
    {
        element.textContent += text.charAt(charIndex);
        await sleep(.01);
    }

    element.textContent += "\r\n\r\n";
}

function loadTitlePage()
{
    title.textContent = 'Introduction'
    narrative.textContent = "Let's explore how different fuel types and engine sizes affect city and highway miles per gallon (MPG).\r\n\r\n"
        + "Note that the vehicle's fuel type is characterized by its color and its engine size is delineated by the data point's diameter.\r\n\r\n"

    var button = document.createElement("button")

    button.id = 'titlePageExplore'
    button.className = 'button'
    button.textContent = "Let's Explore " + rightArrow
    button.style.opacity = 0

    button.setAttribute('onclick', 'nextSlide()')
    document.getElementById('sidebar-narrative').appendChild(button);

    d3.select('#titlePageExplore')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1)
}

async function loadSceneOne()
{    
    title.textContent = 'The Impact of Fuel Type on Mileage'; 
    
    var text = sceneQuestion = 'How does fuel type impact city and highway mileage?';
    await typewriterEffect(narrative, text);

    await sleep(1);

    text = "First, let's focus on electric and diesel vehicles.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'sceneOneExploration';
    button.className = 'button';
    button.textContent = "Focus on Diesel and Electric Vehicles " + rightArrow
    button.style.opacity = 0;

    button.setAttribute('onclick', 'clickedSceneOneButton()')
    document.getElementById('sidebar-narrative').appendChild(button);

    d3.select('#sceneOneExploration')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function clickedSceneOneButton()
{    
    narrative.textContent = sceneQuestion + '\r\n\r\n';

    d3.selectAll('#d-circle')
    .filter((d) => d.Fuel == 'Gasoline')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .03);
    
    await sleep(3);
    
    electricCarsAnnotations();
    
    var text = "Notice how the electric cars are clustered around the top right side of the graph "
    + "because they have high city and highway mileage."
    await typewriterEffect(narrative, text)
    
    await sleep(2)
    
    dieselCarsAnnotations();
    
    text = "Diesel engines are clustered above the majority of gasoline engines, showing that they perform better "
         + "than most gasoline engines in city and highway mileage."
    await typewriterEffect(narrative, text)
    
    await sleep(2)

    await typewriterEffect(conclusionHeader, "Conclusion")    
    
    text = "Fuel type is a significant factor in determining fuel efficiency, with electric vehicles generally "
         + "performing better due to regenerative braking and diesel vehicles performing better than "
         + "most gasoline vehicles due to diesel fuel being more combustible than gasoline."
    await typewriterEffect(conclusionText, text);

    showSlideButtons();
}

function electricCarsAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Electric Vehicles",
            label: "Perform best in the city and highway",
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
        .attr("id", "electric-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#electric-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

function dieselCarsAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Diesel Vehicles",
            label: "Preform better than most gasoline vehicles in the city and highway",
            wrap: 190
        },
        subject: {
            radius: 130
        },
        x: 500,
        y: 520,
        dy: 170,
        dx: 170
    }].map(function(d){ d.color = "#5f5fa7"; return d});

    const makeAnnotations = d3.annotation()
        .notePadding(10)
        .type(type)
        .annotations(annotations);

    graph.append("g")
        .attr("class", "annotation-group")
        .attr('id', "diesel-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#diesel-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function loadSceneTwo()
{
    title.textContent = 'The Impact of Engine Size on Mileage';

    var text = sceneQuestion = 'How does engine size impact city and highway mileage?';
    await typewriterEffect(narrative, text)

    await sleep(1);

    text = "Let's focus on vehicles that have either a small or large engine.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'sceneTwoExploration';
    button.className = 'button';
    button.textContent = "Filter Engine Sizes " + rightArrow
    button.style.opacity = 0;

    button.setAttribute('onclick', 'clickedSceneTwoButton()')
    document.getElementById('sidebar-narrative').appendChild(button);

    d3.select('#sceneTwoExploration')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function clickedSceneTwoButton()
{
    narrative.textContent = sceneQuestion + '\r\n\r\n'

    d3.selectAll('#d-circle')
    .filter((d) => d.EngineCylinders > 4 && d.EngineCylinders < 12)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05)
    
    await sleep(3)

    electricEngineAnnotations()

    var text = "Electric vehicles do not have engine cylinders, therefore all the energy goes to the motor instead of "
        + "firing engine cylinders."
    await typewriterEffect(narrative, text)

    await sleep(2)

    smallEngineAnnotations()

    largeEngineAnnotations()

    text = "The more cylinders an engine has, the less fuel efficient it is. Hence, vehicles with smaller engines "
         + "have better mileage than larger engines."
    await typewriterEffect(narrative, text)

    await typewriterEffect(conclusionHeader, "Conclusion")

    text = "Larger engines typically consume more fuel, resulting in a lower MPG. So, although fun to drive, cars with many "
         + "cylinders have relatively low fuel efficiency."
    await typewriterEffect(conclusionText, text)

    showSlideButtons()
}

function electricEngineAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Zero Cylinders (Electric Engine)",
            label: "Performs best in the city and highway",
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
        .attr("id", "electric-engine-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.selectAll('#electric-engine-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

function smallEngineAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Small (2-4) Engine Cylinders",
            label: "Preform better than larger engines in the city and highway",
            wrap: 190
        },
        subject: {
            radius: 190
        },
        x: 540,
        y: 560,
        dy: 170,
        dx: 170
    }].map(function(d){ d.color = "#5f5fa7"; return d});

    const makeAnnotations = d3.annotation()
        .notePadding(10)
        .type(type)
        .annotations(annotations);

    graph.append("g")
        .attr("class", "annotation-group")
        .attr('id', "small-engine-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#small-engine-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

function largeEngineAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Large (12) Engine Cylinders",
            label: "Preform the worst in the city and highway",
            wrap: 190
        },
        subject: {
            radius: 100
        },
        x: 155,
        y: 720,
        dy: 85,
        dx: 100
    }].map(function(d){ d.color = "#5f5fa7"; return d});

    const makeAnnotations = d3.annotation()
        .notePadding(10)
        .type(type)
        .annotations(annotations);

    graph.append("g")
        .attr("class", "annotation-group")
        .attr('id', "large-engine-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#large-engine-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function loadSceneThree()
{
    title.textContent = 'The Impact of Fuel Type and Engine Size on Mileage'

    var text = sceneQuestion = 'How does the combination of fuel type and engine size improve overall fuel efficiency?'
    await typewriterEffect(narrative, text)

    await sleep(1);
    
    text = "Let's explore how engine size and fuel type affect fuel efficiency.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'sceneThreeButton';
    button.className = 'button';
    button.textContent = "Explore " + rightArrow
    button.style.opacity = 0;

    button.setAttribute('onclick', 'clickedSceneThreeButton()')
    document.getElementById('sidebar-narrative').appendChild(button);

    d3.select('#sceneThreeButton')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function clickedSceneThreeButton()
{
    narrative.textContent = sceneQuestion + '\r\n\r\n';

    d3.selectAll('#d-circle')
    .filter((d) => d.Fuel != 'Electricity')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);

    electricEngineAnnotations();
    
    var text = "Electric cars consistently outperform diesel and gasoline vehicles due to regenerative braking."
    await typewriterEffect(narrative, text)

    await sleep(3);

    resetGraph()
    fadeOutAnnotation('#electric-engine-annotation')
    fadeOutAllButEngine(4)
    engineSizeFourAnnotations()

    text = "Four-cylinder diesel vehicles perform better in the city and highway than most four-cylinder gasoline vehicles due to diesel fuel being more "
         + "combustible than gasoline."
    await typewriterEffect(narrative, text)
    
    await sleep(3);

    resetGraph()
    fadeOutAnnotation('#four-cylinders-annotation')
    fadeOutAllButEngine(6)
    engineSizeSixAnnotations()

    text = "Contrary to popular belief, six-cylinder diesel vehicles perform worse on the highway than most six-cylinder gasoline vehicles."
    await typewriterEffect(narrative, text)
    
    await sleep(5)

    fadeInAllHighlights()
    await typewriterEffect(conclusionHeader, "Conclusion")    
    
    text = "There is a complex interplay between fuel type and engine size. Although electric cars perform the best, four-cylinder diesel engines perform better "
         + "than most gasoline counterparts. In contrast, six-cylinder diesel engines perform worse on the highway than most equivalently sized gasoline engines."
    await typewriterEffect(conclusionText, text);

    showSlideButtons();
}

function fadeOutAllButEngine(size)
{
    d3.selectAll('#d-circle')
    .filter((d) => d.EngineCylinders != size)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);
}

function fadeInAllHighlights()
{
    d3.selectAll('#d-circle')
    .filter((d) => d.EngineCylinders == 4 
        || d.EngineCylinders == 6
        || d.Fuel == 'Electricity')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", 1);

    fadeInAnnotation('#electric-engine-annotation')
    fadeInAnnotation('#four-cylinders-annotation')
}

function fadeOutAnnotation(annotation)
{
    d3.selectAll(annotation)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .1);
}

function fadeInAnnotation(annotation)
{
    d3.selectAll(annotation)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", 1);
}

function engineSizeFourAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Four Cylinders",
            label: "Diesel engine performs better in the city and highway.",
            wrap: 190
        },
        subject: {
            radius: 130
        },
        x: 500,
        y: 540,
        dy: -190,
        dx: 190
    }].map(function(d){ d.color = "#5f5fa7"; return d});

    const makeAnnotations = d3.annotation()
        .notePadding(10)
        .type(type)
        .annotations(annotations);

    graph.append("g")
        .attr("class", "annotation-group")
        .attr('id', "four-cylinders-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#four-cylinders-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

function engineSizeSixAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Six Cylinders",
            label: "Diesel engine performs better in the city. Gasoline engine performs better on the highway.",
            wrap: 190
        },
        subject: {
            radius: 130
        },
        x: 400,
        y: 640,
        dy: 130,
        dx: 130
    }].map(function(d){ d.color = "#5f5fa7"; return d});

    const makeAnnotations = d3.annotation()
        .notePadding(10)
        .type(type)
        .annotations(annotations);

    graph.append("g")
        .attr("class", "annotation-group")
        .attr('id', "six-cylinders-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#six-cylinders-annotation')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function loadConclusion()
{
    title.textContent = 'Conclusion'
    await typewriterEffect(conclusionHeader, "Main Findings")

    var ul = document.getElementById('list')

    productList = ['Fuel type significantly affects MPG','Engine size inversely relates to fuel efficiency',
        'Fuel type and engine size provide deeper insights into fuel efficiency trends'];

    productList.forEach(renderProductList);

    function renderProductList(element, index, arr) {
        var li = document.createElement('li');
        li.style.opacity = 0;

        ul.appendChild(li);

        li.innerHTML=li.innerHTML + element;
    }

    d3.selectAll('li')
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("opacity", 1);

    await sleep(1)

    var text = "Consider these factors when choosing a vehicle to balance performance and fuel economy."
    await typewriterEffect(conclusionText, text);

    var button = document.createElement("button");

    button.id = 'userExplore';
    button.className = 'button';
    button.textContent = "Explore the Data Yourself " + rightArrow
    button.style.opacity = 0;

    button.setAttribute('onclick', 'clickedUserExplore()')
    document.getElementById('sidebar-conclusion').appendChild(button);

    d3.select('#userExplore')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function clickedUserExplore()
{
    conclusionText.textContent = 'Consider these factors when choosing a vehicle to balance performance and fuel economy.\r\n\r\n';

    d3.selectAll('#legend-options')
        .on('click', (d) => filters(d))
        .style("cursor", 'pointer')
    
    d3.selectAll('#legend-box')
        .style("opacity", 1)

    var tooltip = d3.select('#graph-div')
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#d3d3ff")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "1px")
        .style("padding", "10px")
        .style('position', "absolute")
    
    var mouseover = function(d) {
        tooltip
        .style("opacity", 1)
    }
    
    var mousemove = function(d) {
        var mouse = d3.mouse(this);
        tooltip
        .html("City MPG: " + d.AverageCityMPG + "<br>Highway MPG: " + d.AverageHighwayMPG + "<br>Cylinders: " + d.EngineCylinders)
        .style("top", mouse[1]+120 + "px")
        .style("left", mouse[0]+500 + "px")
    }
    
    var mouseleave = function(d) {
        tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
    
    graph.selectAll('#d-circle')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    var text = "Hover over the data points to see more details or filter data by select a fuel type from the legend on the bottom right."
    await typewriterEffect(conclusionText, text)

    nextButton.textContent = 'Restart Presentation';
    
    nextButton.style.visibility = 'visible';
    backButton.style.visibility = 'visible';
    replayButton.style.visibility = 'visible';
}

function filters(fuel)
{
    d3.selectAll('#d-circle')
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .style('opacity', 1);

    switch (fuel)
    {
        case 'Electric':
            d3.selectAll('#d-circle')
            .filter((d) => d.Fuel != 'Electricity')
            .transition()
            .duration(50)
            .ease(d3.easeLinear)
            .style("opacity", .05);
            return
        case 'Gasoline':
            d3.selectAll('#d-circle')
            .filter((d) => d.Fuel != 'Gasoline')
            .transition()
            .duration(50)
            .ease(d3.easeLinear)
            .style("opacity", .05);
            return
        case 'Diesel':
            d3.selectAll('#d-circle')
            .filter((d) => d.Fuel != 'Diesel')
            .transition()
            .duration(50)
            .ease(d3.easeLinear)
            .style("opacity", .05);
            return
    }
}

async function sleep(seconds)
{
    await new Promise(r => setTimeout(r, seconds * 1000));
}