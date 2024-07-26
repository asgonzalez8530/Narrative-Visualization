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

var currentSlide = 3; // TODO: revert back to slide zero

// common elements
var title = document.getElementById('sidebar-title')
var narrative = document.getElementById('sidebar-narrative')
var conclusionHeader = document.getElementById('sidebar-conclusion-header')
var conclusionText = document.getElementById('sidebar-conclusion')
var backButton = document.getElementById('back-button')
var nextButton = document.getElementById('next-button')

async function loadSlide()
{
    resetSideBarContent();
    drawGraph();
    switch (currentSlide)
    {
        default:
        case 0:
            currentSlide = 0;
            loadTitlePage();
            return;
        case 1:
            await loadSceneOne();
            break;
        case 2: 
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
    // showSlideButtons();
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
    .attr('fill', (d) => fuelTypeColor(d.Fuel));
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

function loadTitlePage()
{
    title.textContent = 'Introduction'; 
    narrative.textContent = 'Let\'s explore how different fuel types and engine sizes affect city and highway miles per gallon (MPG).';

    backButton.style.visibility = 'hidden';

    nextButton.textContent = 'Let\'s Explore \u2192';
    nextButton.style.visibility = 'visible';
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

function resetSideBarContent()
{
    title.textContent = ''
    narrative.textContent = ''
    conclusionHeader.textContent = ''
    conclusionText.textContent = ''

    backButton.style.visibility = 'hidden'
    nextButton.style.visibility = 'hidden'

    d3.selectAll(".annotations").remove()
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

async function loadSceneOne()
{    
    title.textContent = 'The Impact of Fuel Type on Mileage'; 
    
    var text = 'How does fuel type impact city and highway mileage?';
    await typewriterEffect(narrative, text);

    await sleep(1);

    text = "First, let's focus on the electric and diesel vehicles.";
    await typewriterEffect(narrative, text);

    var button = document.createElement("button");

    button.id = 'unfocusGasButton';
    button.className = 'button';
    button.textContent = "Focus on Diesel and Electric Vehicles"
    button.style.opacity = 0;

    button.setAttribute('onclick', 'clickedUnfocusGasButton()')
    document.getElementById('sidebar-narrative').appendChild(button);

    d3.select('#unfocusGasButton')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function clickedUnfocusGasButton()
{    
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    d3.selectAll('circle')
    .filter((d) => d.Fuel == 'Gasoline')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);
    
    await sleep(3);
    
    electricCarsAnnotations();
    
    var text = "Notice how the electric cars are clustered around the top right side of the graph "
    + "showing they have high city and highway mileage."
    
    await typewriterEffect(narrative, text)
    
    await sleep(2)
    
    dieselCarsAnnotations();
    
    text = "Diesel engines are clustered above most gasoline engines illustrating that they perform better "
         + "than most gasoline engines in city and highway mileage."
    
    await typewriterEffect(narrative, text)
    
    await sleep(2)

    await typewriterEffect(conclusionHeader, "Conclusion")    
    
    text = "Fuel type is a significant factor in determining fuel efficiency, with electric vehicles generally "
         + "performing better due to regenerative braking and diesel vehicles performing better than "
         + " most gasoline vehicles due to diesel fuel being more combustible than gasoline."
    
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
            label: "Perform highest in the city and highway",
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

    button.id = 'unfocusMidRangeEngines';
    button.className = 'button';
    button.textContent = "Filter Engine Sizes"
    button.style.opacity = 0;

    button.setAttribute('onclick', 'clickedUnfocusMidRangeEngines()')
    document.getElementById('sidebar-narrative').appendChild(button);

    d3.select('#unfocusMidRangeEngines')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}

async function clickedUnfocusMidRangeEngines()
{
    narrative.textContent = 'How does engine size impact city and highway mileage?\r\n\r\n';

    d3.selectAll('circle')
    .filter((d) => d.EngineCylinders > 4 && d.EngineCylinders < 12)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);
    
    await sleep(3);

    noEngineAnnotations();

    var text = "Electric vehicles do not have engine cylinders, therefore all the energy goes to the motor instead of "
        + "firing engine cylinders."

    await typewriterEffect(narrative, text)

    await sleep(2)

    smallEngineAnnotations()

    largeEngineAnnotations()

    text = "The more cylinders an engine has the less fuel efficient it is. Hence why "
         + "vehicles with smaller engines have a higher city and highway MPG."
    
    await typewriterEffect(narrative, text)

    await typewriterEffect(conclusionHeader, "Conclusion")    
    
    text = "Larger engines typically consume more fuel, resulting in a lower MPG. So, although fun to drive, cars will lots "
         + "of cylinders have relatively low fuel efficiency."
    
    await typewriterEffect(conclusionText, text);

    showSlideButtons();
}

function noEngineAnnotations()
{
    const type = d3.annotationCalloutCircle
    const annotations = [{
        type: d3.annotationCalloutCircle,
        note: {
            title: "Zero Engine Cylinders",
            label: "Perform highest in the city and highway",
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
        .attr("id", "no-engine-annotation")
        .call(makeAnnotations)
        .style("opacity", 0);
    
    d3.select('#no-engine-annotation')
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
    title.textContent = 'The Impact of Fuel Type and Engine Size on Mileage'

    var text = 'How does the combination of fuel type and engine size overall fuel efficiency?'
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
    narrative.textContent = 'How does the combination of fuel type and engine size overall fuel efficiency?\r\n\r\n';

    d3.selectAll('circle')
    .filter((d) => d.Fuel != 'Electricity')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);

    electricCarsAnnotations();

    await sleep(8);

    d3.selectAll('circle')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", 1);

    d3.select('#electric-annotation')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .1);

    d3.selectAll('circle')
    .filter((d) => selectAllButEngineSize(d, 4))
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);
    
    await sleep(8);

    d3.selectAll('circle')
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", 1);

    d3.selectAll('circle')
    .filter((d) => selectAllButEngineSize(d, 6))
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .style("opacity", .05);

    
    var text = "Say something important here :)"
    
    await typewriterEffect(narrative, text)
    
    await sleep(2)

    await typewriterEffect(conclusionHeader, "Conclusion")    
    
    text = "TODO"
    
    await typewriterEffect(conclusionText, text);

    showSlideButtons();
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
    title.textContent = 'Conclusion'; 
    narrative.textContent = 'How does fuel type impact average highway and city MPG?\r\n\r\n';

    await sleep(2);
    
    var text = "Fuel type ...";
    
    await typewriterEffect(narrative, text);

    backButton.style.visibility = 'visible';
    backButton.textContent = '\u2190 Back';

    nextButton.style.visibility = 'visible';
    nextButton.textContent = 'Restart';
}

async function sleep(seconds)
{
    await new Promise(r => setTimeout(r, seconds * 1000));
}

function selectAllButEngineSize(data, size)
{
    return !(data.EngineCylinders == size)
}

function selectAllButEngineSize(data, size)
{
    return !(data.EngineCylinders == size)
}