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

var currentSlide = 4; // TODO: revert back to slide zero

// common elements
var title = document.getElementById('sidebar-title')
var narrative = document.getElementById('sidebar-narrative')
var conclusionHeader = document.getElementById('sidebar-conclusion-header')
var conclusionText = document.getElementById('sidebar-conclusion')
var backButton = document.getElementById('back-button')
var nextButton = document.getElementById('next-button')

async function loadSlide()
{
    await resetPage()
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
            // await drawConclusionGraph()
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

async function resetPage()
{
    title.textContent = ''
    narrative.textContent = ''
    conclusionHeader.textContent = ''
    conclusionText.textContent = ''

    backButton.style.visibility = 'hidden'
    nextButton.style.visibility = 'hidden'

    document.getElementById("list").innerHTML = '';

    d3.selectAll(".annotations").remove()

    await drawGraph()
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
    .style('opacity', 0)
}

function fuelTypeColor(fuelType)
{
    switch (fuelType)
    {
        case "Gasoline":
            return '#305cde'; // blue
        case "Electricity":
            return '#45a049'; // green
        case "Diesel":
            return '#c91b00'; // red
    }
}

function resetGraph()
{
    d3.selectAll('circle')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style('opacity', 1);
}

function showSlideButtons()
{
    backButton.style.visibility = 'visible';
    backButton.textContent = '\u2190 Back';
    
    nextButton.style.visibility = 'visible';
    nextButton.textContent = 'Next \u2192';
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
    narrative.textContent = "Let's explore how different fuel types and engine sizes affect city and highway "
        + "miles per gallon (MPG).\r\n\r\n"

    var button = document.createElement("button")

    button.id = 'titlePageExplore'
    button.className = 'button'
    button.textContent = "Let's Explore \u2192"
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
    
    var text = 'How does fuel type impact city and highway mileage?';
    await typewriterEffect(narrative, text);

    await sleep(1);

    text = "First, let's focus on the electric and diesel vehicles.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'sceneOneExploration';
    button.className = 'button';
    button.textContent = "Focus on Diesel and Electric Vehicles"
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
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    d3.selectAll('circle')
    .filter((d) => d.Fuel == 'Gasoline')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .03);
    
    await sleep(3);
    
    electricCarsAnnotations();
    
    var text = "Notice how the electric cars are clustered around the top right side of the graph "
    + "showing they have high city and highway mileage."
    await typewriterEffect(narrative, text)
    
    await sleep(2)
    
    dieselCarsAnnotations();
    
    text = "Diesel engines are clustered above most gasoline engines, illustrating that they perform better "
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

    var text = 'How does engine size impact city and highway mileage?';
    await typewriterEffect(narrative, text)

    await sleep(1);

    text = "Let's focus on vehicles with small and large engines.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'sceneTwoExploration';
    button.className = 'button';
    button.textContent = "Filter Engine Sizes"
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
    narrative.textContent = 'How does engine size impact city and highway mileage?\r\n\r\n'

    d3.selectAll('circle')
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

    text = "The more cylinders an engine has, the less fuel efficient it is. Hence, why "
         + "vehicles with smaller engines have a higher city and highway MPG."
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

    var text = 'How does the combination of fuel type and engine size improve overall fuel efficiency?'
    await typewriterEffect(narrative, text)

    await sleep(1);
    
    text = "Let's explore how engine size and fuel type affect fuel efficiency.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'sceneThreeButton';
    button.className = 'button';
    button.textContent = "Explore \u2192"
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
    narrative.textContent = 'How does the combination of fuel type and engine size improve overall fuel efficiency?\r\n\r\n';

    d3.selectAll('circle')
    .filter((d) => d.Fuel != 'Electricity')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);

    electricEngineAnnotations();
    
    var text = "Electric cars consistently outperform diesel and gasoline vehicles due to regenerative braking."
    await typewriterEffect(narrative, text)

    await sleep(5);

    resetGraph()
    fadeOutAnnotation('#electric-engine-annotation')
    fadeOutAllButEngine(4)
    engineSizeFourAnnotations()

    text = "Four-cylinder diesel vehicles perform better on the highway than most four-cylinder gasoline vehicles due to diesel fuel being more "
         + "combustible than gasoline."
    await typewriterEffect(narrative, text)
    
    await sleep(5);

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
    d3.selectAll('circle')
    .filter((d) => d.EngineCylinders != size)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);
}

function fadeInAllHighlights()
{
    d3.selectAll('circle')
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
            label: "Diesel engine performs better in the city and on the highway.",
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
            label: "Diesel engine performs better in the city. Gasoline engines perform better on the highway.",
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

    await sleep(2)

    var text = "Consider these factors when choosing a vehicle to balance performance and fuel economy."
    await typewriterEffect(conclusionText, text);

    var button = document.createElement("button");

    button.id = 'userExplore';
    button.className = 'button';
    button.textContent = "Explore the Data Yourself \u2192"
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

    var text = "Hover over the data points to see more details."
    await typewriterEffect(conclusionText, text)

    backButton.style.visibility = 'visible';
    backButton.textContent = '\u2190 Back';

    nextButton.style.visibility = 'visible';
    nextButton.textContent = 'Restart';
}

async function sleep(seconds)
{
    await new Promise(r => setTimeout(r, seconds * 1000));
}