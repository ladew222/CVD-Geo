
const config_new = {

    label: function(d) {
        var text = "<b class='p-head'>"+ d.County + "</b><span class='p-other'></br>Confirmed: " + d.Confirmed + "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death +  "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + "</br>Gini Index: " + d.IncomeIneq + "</BR>Grocery Mobility: " + d['Grocery & pharmacy'] +  "</BR>Retail and Recreation: " + d['Retail & recreation'] + "</BR>Residential Mobility: " + d.Residential +  "</BR>Workplace Mobility: " + d.Workplace_map + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>No Insur 35-64 10k: " + d.insured35to64_per10k + "</span>" ;
        return "" + text;
    },
    ocean: "transparent",
    projection: "geoAlbersUsa",
    topojson: "https://d3plus.org/topojson/counties.json",
    type: "Geomap"
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var viz = {
    itemList:[],
    start_day: "3",
    start_month: "4",
    number_days:7,
    primary_var:"Confirmed",
    active_day: 0,
    active_state:0,
    color_range:0,
    days_in_month: 30,
    mobility_data: false,
    start_date: null,
    end_date:null,
    plot_count:0,
    plot_type:'Confirmed_total',
    plot_x:0,
    nested_data:null
};

const map = new d3plus.Geomap()
    .config(config_new)
    .data(viz.itemList[0])
    .colorScale("Confirmed");


const timeConv = d3.timeParse("%m-%d-%Y");


function build_map(primary_var){
    let Filtered = null;
    if(viz.active_state!=0){
        Filtered = viz.itemList[viz.active_day].filter(function (el) {
            return el.state == parseInt(viz.active_state);
        });
    }
    else{
        Filtered = viz.itemList[viz.active_day];
    }
    let test_arr =[0,viz.color_range];
    if(primary_var=='Percent_Change'){
        new Promise(function(fulfill, reject){
            //do something for 5 second
            fulfill(delta());
        }).then(function(result){

            if (viz.color_range==0){
                map
                    .data(Filtered)
                    .fitFilter(function(d) {
                      const state = parseInt(d.id.split('US')[1].substring(0, 2));
                        if( viz.active_state!=0  ){
                            return [ viz.active_state].indexOf(state)<0;
                        }
                        else{
                            return true;
                        }
                    })
                    .colorScale(primary_var)
                    .render();
            }
            else{
                map
                    .data(Filtered)
                    .label(function(d) {
                        var text =  "<b class='p-head'>"+ d.County + "</b><span class='p-other'>" + "</br>% Change: "+ d.Percent_Change +"</br>Confirmed: "  + d.Confirmed +  "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death + "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + mobility + "</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>UnInsured 35to64 10k: " + d.insured35to64_per10k + "</span>" ;
                        return text;
                    })
                    .fitFilter(function(d) {
                        const state = parseInt(d.id.split('US')[1].substring(0, 2));
                        if( viz.active_state!=0  ){
                            return [ viz.active_state].indexOf(state)<0;
                        }
                        else{
                            return true;
                        }
                    })
                    .colorScale(primary_var)
                    .colorScaleConfig({axisConfig: {
                            domain: test_arr
                        }})
                    .render();

            }


        });
    }
    else{
        if (viz.color_range==0){
            map
                .data(Filtered)
                .fitFilter(function(d) {
                      const state = parseInt(d.id.split('US')[1].substring(0, 2));
                      if( viz.active_state!=0  ){
                          return [ viz.active_state].indexOf(state)<0;
                      }
                      else{
                          return true;
                      }
                })
                .colorScale(primary_var)
                .render();
        }
        else{
            map
                .data(Filtered)
                .fitFilter(function(d) {
                      const state = parseInt(d.id.split('US')[1].substring(0, 2));
                      if( viz.active_state!=0  ){
                          return [ viz.active_state].indexOf(state)<0;
                      }
                      else{
                          return true;
                      }
                })
                .colorScale(primary_var)
                .colorScaleConfig({axisConfig: {
                        domain: test_arr
                    }})
                .render();
        }

    }


}

make_day = d3.timeFormat('%b %d');

///////////////////////////////////////////////
/////////////// Jquery Section ////////////////
///////////////////////////////////////////////https://www.d3-graph-gallery.com/graph/basic_datamanipulation.html

$(document).ready(function(){
    const start_date = new Date(new Date().getTime() - (240 * 60 * 60 * 1000));
    viz.start_date = start_date;
    const end_date= new Date(new Date().getTime() - (48 * 60 * 60 * 1000));
    viz.end_date= end_date;
    const start_month = start_date.getUTCMonth() + 1; //months from 1-12
    const start_day = start_date.getUTCDate(); + 1; //months from 1-12
    viz.start_day = start_day;
    viz. start_month= start_month;
    viz.days_in_month = getDaysInMonth(start_month,2020);
    viz.start_day=start_day;
    viz.start_month=start_month;

    map
        .select('#viz')
        .render();

    $( document ).tooltip();

    /*$(".two-col").on("click", "c1", function(event){
        console.log($(this).text());
    });*/



    $('#toggle-plot').change(function() {
        //$('#console-event').html('Toggle: ' + $(this).prop('checked'))
        $( ".plot-toggle" ).toggle();
        $( "#start" ).toggle();

    })

    $('#plot-type').on('change', function() {
        //alert( this.value );
        viz.plot_type=this.value;
    });

    $('#days').on('click', 'a.days', function() {
        const click_day = parseInt($(this).data( "day" ));
        const click_type = $(this).data( "type" );

        $("a.days").removeClass("active");
        // $(".tab").addClass("active"); // instead of this do the below
        $(this).addClass("active");
        viz.primary_var = $("input[name='my_options']:checked").val();
        let test_arr =[0,viz.color_range];
        viz.active_day=click_day;

        if(click_type=='mobile'){
            viz.mobility_data=true;
            gmb()
                .then(value => {
                    console.log(value) // 1
                    setTimeout(function () {
                        if (-1 == -1) {
                            build_map(viz.primary_var);
                        }
                    }, 5000);


                })
        }
        else{
            build_map(viz.primary_var);
        }

    });


    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({max:200,
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            viz.color_range=ui.value;
            handle.text( ui.value );
        }
    });
    var handle2 = $( "#custom-handle2" );
    $( "#slider2" ).slider({max:1500000,step: 20,
        create: function() {
            handle2.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            viz.plot_x=ui.value;
            handle2.text( ui.value );
        }
    });



    $( "#slider-range" ).slider({
        range: true,
        min: new Date('2020-03-14').getTime() / 1000,
        max: new Date().getTime() / 1000,
        step: 86400,
        values: [ new Date(new Date().getTime() - (240 * 60 * 60 * 1000)).getTime() / 1000, new Date(new Date().getTime() - (48 * 60 * 60 * 1000)).getTime() / 1000 ],
        slide: function( event, ui ) {
            const start_date = new Date(ui.values[ 0 ] *1000);
            viz.start_date= start_date;
            const end_date= new Date(ui.values[ 1 ] *1000);
            viz.end_date = end_date;
            const start_month = start_date.getUTCMonth() + 1; //months from 1-12
            const start_day = start_date.getUTCDate(); + 1; //months from 1-12
            viz.days_in_month = getDaysInMonth(start_month,2020);
            viz.start_day=start_day;
            viz.start_month=start_month;
            const diffTime = Math.abs(start_date - end_date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            viz.number_days= diffDays;
            $( "#amount" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + end_date.toDateString() );
        }
    });

    $( "#amount" ).val( (new Date($( "#slider-range" ).slider( "values", 0 )*1000).toDateString()) +
        " - " + (new Date($( "#slider-range" ).slider( "values", 1 )*1000)).toDateString());


    $(".cus_dy_lnk").click(function(){

        $( "#viz" ).html($( ".hidden" ).html());

    });

    $("#clear").click(function(){

        clear_plot();
        viz.plot_count=0;

    });


    $("#test").button().click(function(){

        $( "#corr-res" ).html(corr_test(viz.active_day));

    });
    $("#plot").button().click(function(event){
        event.preventDefault();
        plot(viz.plot_type);

    });

    $('.c2').on('click', 'a.plot', function() {
        const val = $(this).data( "type" );
        plot(val);

    });


    //    button click
    $("#btnSubmit").button().click(function(){
        //$('#viz').empty();
        for (i = 0; i < viz.number_days; i++) {
            get_data(i);
            let day_now = null;
            let month_now = null;
            if (viz.start_day+i > viz.days_in_month){
                month_now = viz.start_month+1;
                day_now = (parseInt(viz.start_day)+i) - viz.days_in_month;
            }
            else{
                month_now = viz.start_month;
                day_now = parseInt(viz.start_day)+i;
            }
            //if need switch month

            $("#days .c1").append("<a class='days dn-"+ i + "' data-type='std' data-day='" + i +  "'  href='#'>View map for "+  month_now  + "/" + day_now +  "</a></br>");

        }



    });

    $('#my_radio_box').change(function(){
        viz.primary_var = $("input[name='my_options']:checked").val();
        if (viz.primary_var=="ConfirmedPer10K"){
            $("#slider").slider('option',{min: 0, max: 5,step: 0.05,});

        }
        if (viz.primary_var=="Confirmed"){
            $("#slider").slider('option',{min: 0, max: 1000,step: 10,});
        }
        if( viz.primary_var=="Fatality_Rate") {
            $("#slider").slider('option',{min: 0, max: .5,step: 0.005,});
        }
        if( viz.primary_var=="Percent_Change") {
            $("#slider").slider('option',{ min:0,max: 1200,step: 5});
        }
        if( viz.primary_var=="Workplace") {
            $("#slider").slider('option',{ min:-60,max: 100,step: 1});
        }
        if( viz.primary_var=="Retail & recreation") {
            $("#slider").slider('option',{ min:-60,max: 100,step: 1});
        }

    });
    var isshow = localStorage.getItem('isshow');
    if (isshow== null) {
        localStorage.setItem('isshow', 1);

        jQuery.noConflict();
        $('#welcome').modal('toggle');
    }


});

///////////////////////////////////////////////
/////////////// JS Section ////////////////
///////////////////////////////////////////////

var getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
// Here January is 0 based
// return new Date(year, month+1, 0).getDate();
};

function getAllIndexes(arr) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] == null)
            indexes.push(i);
    return indexes;
}
d3.csv("us-state-fips.csv").then(function(data) {
    var select = d3.select("#states")
        .append("div")
        .append("select")

    select
        .on("change", function(d) {
            viz.active_state = d3.select(this).property("value");
        });

    select.selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function (d) { return d.st; })
        .text(function (d) { return d.stname; });
});

function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}


const config = {
    groupBy: "ID State",
    label: function(d) {
        var text = d.County + "</br>Confirmed: " + d.Confirmed + "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death + "<BR/>Population: "+ d.TotalPop + "</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>UnInsured 35to64 10k: " + d.insured35to64_per10k ;
    },
    ocean: "transparent",
    projection: "geoAlbersUsa",
    topojson: "https://d3plus.org/topojson/states.json",
    /*time: d => d.Year || d["End Year"],*/
    type: "Geomap"
};

function delta(){

    let arr1=viz.itemList[0];
    let arr2 =viz.itemList[viz.active_day];

    /* const arr1 = [
         {"id": "5c5030b9a1ccb11fe8c321f4", "quantity": 1},
         {"id": "344430b94t4t34rwefewfdff", "quantity": 5},
         {"id": "342343343t4t34rwefewfd53", "quantity": 3}
     ];
     const arr2 = [
         {"id": "5c5030b9a1ccb11fe8c321f4", "quantity": 2},
         {"id": "344430b94t4t34rwefewfdff", "quantity": 1}
     ];*/

    const result = Object.values([...arr1, ...arr2].reduce((acc, { id, Confirmed }) => {
        acc[id] = { id, Confirmed_tot:  Confirmed - (acc[id] ? acc[id].Confirmed_tot : 0) , Confirm_old:(acc[id] ? acc[id].Confirmed_tot : 0) , Confirm_new: Confirmed, Percent_Change:  (Confirmed - (acc[id] ? acc[id].Confirmed_tot : 0))/(acc[id] ? acc[id].Confirmed_tot : 0)};
        return acc;
    }, {}));

    //console.log(result);

    const a1 = viz.itemList[viz.active_day];
    const a2 =  result;
    let merged = [];
    for(let i=0; i<a1.length; i++) {
        merged.push({
            ...a1[i],
            ...(a2.find((itmInner) => itmInner.id === a1[i].id))}
        );
    }
    viz.itemList[viz.active_day] = merged;
    //viz.itemList[0].forEach(function(d){ d['Confirmed'] = +d['Confirmed']; });
    viz.itemList[viz.active_day].forEach(function(d){
        if( isFinite(d['Percent_Change'])==false){
            d['Percent_Change']=1000;
        }
    })

    console.log(merged);


}
/////end jquery

function create_bar(strength,factor)
{
    const l1 = "<svg class='bar' width=\""+ strength*factor +"\" height=\"18\">"
    let l2 = null;
    if (Math.sign(strength)==1){
        l2 ="<rect x=\"0\" y=\"0\" width=\""+ strength*(factor-5) + "\" height=\"18\" fill=\"green\" />";
    }
    else{
        strength= Math.abs(strength);
        l2 ="<rect x=\"0\" y=\"0\" width=\""+ strength*(factor-5) + "\" height=\"18\" fill=\"red\" />";
    }

    const l3 ="</svg>";
    return l1+ l2+l3;
}

function plot(type){
    let plots = [];
    let xvals = [];
    let Filtered=null;
    //viz.total = d3.merge([viz.itemList[0],viz.itemList[1],viz.itemList[3]]);
    viz.total = d3.merge(viz.itemList);

    viz.nested_data = d3.nest()
        .key(function(d) { return d.State; })
        .rollup(function(v) { return {
            count: v.length,
            total_confirmed: d3.sum(v, function(d) { return d.Confirmed; }),
            total_death: d3.sum(v, function(d) { return d.Death; }),
            log_total_death: d3.sum(v, function(d) { return Math.log10(d.Death); }),
            log_total_confirmed: d3.sum(v, function(d) { return Math.log10(d.Confirmed); }),
            avg_confirmed: d3.mean(v, function(d) { return d.Confirmed; })
        }; })
        .key(function(d) { return d.day; })
        .entries(viz.total);


    draw_plot(plots);

}

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");


// we are appending SVG first
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#start").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


function clear_plot(){
    //d3.select("#start").remove();
    //d3.select("#start").selectAll("*").remove();
    svg.selectAll("*").remove();
// set the ranges
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);



}

function draw_plot(data){
    // format the data
    /* data.forEach(function(d) {
         d.date = parseTime(d.date.toISOString());
         d.close = +d.close;
     });*/

    let dd = viz.nested_data.filter(function(d){return d.key == 'Ohio';})
    const state= dd[0].key;
    let slices2 = dd[0].values.map(function(d){
        return {
            date: timeConv(d.key),
            measurement: d.value.total_confirmed
        }
    });
    let slices = [];
     slices.push({id:state, values:slices2});

    let id = 0;
    const ids = function () {
        return "line-"+id++;
    }


// returns the sliced dataset
    console.log("Slices",slices);
// returns the first slice
    console.log("First slice",slices[0]);
// returns the array in the first slice
    console.log("A array",slices[0].values);
// returns the date of the first row in the first slice
    console.log("Date element",slices[0].values[0].date);
// returns the array's length
    console.log("Array length",(slices[0].values).length);

    // Scale the range of the data
   /* x.domain(d3.extent(slices.values, function(d) {
        return timeConv(d.date);
    }));*/

   /* x.domain(d3.extent(slices, function(d) {
        return d3.extent(d.values, function(e){
            return e.date
        });

    }));*/

    x.domain(d3.extent([viz.start_date,viz.end_date]));
    y.domain([0, d3.max(slices, function(d) {
        return d3.max(d.values, function(d) {
            return d.measurement + 10; });
        })
    ]);

    const yaxis = d3.axisLeft()
        .ticks((slices[0].values).length)
        .scale(y);

    const xaxis = d3.axisBottom()
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat('%b %d'))
        .scale(x);

    const line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.measurement); });

    viz.plot_count++;
    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(slices[0].values)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.measurement); });

    // Add the X Axis
    /*svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));*/

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Frequency");

    const lines = svg.selectAll("lines")
        .data(slices)
        .enter()
        .append("g");

    lines.append("path")
        .attr("class", ids)
        .attr("d", function(d) { return line(d.values); });

    lines.append("text")
        .attr("class","serie_label")
        .datum(function(d) {
            return {
                id: d.id,
                value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.date) + 10)
                + "," + (yScale(d.value.measurement) + 5 ) + ")"; })
        .attr("x", 5)
        .text(function(d) { return ("Serie ") + d.id; });












}

function corr_test(the_day){
    let testArr=["IncomeIneq","EuropePop10k","AsiaPop10k","insured35to64_per10k","white10k","med_age","perCapitaIncome","bachelor_degreeM_per10k","perCapitaIncome","UrbanPer10k","Grocery & pharmacy","Retail & recreation","Residential","Workplace"];
    /*if(viz.mobility_data==true){
        testArr.push("Residential","Workplace");
    }*/
    let out_str="<div class='corr-rs'>";
    testArr.forEach(function(number, i) {
        let val = testArr[i];
        let Confirmed= null;
        let val1 = null
        let Filtered = null;
        if (parseInt(viz.active_state) !=0){
            Filtered = viz.itemList[viz.active_day].filter(function (el) {
                return el.state == parseInt(viz.active_state);
            });
        }
        else{
            Filtered = viz.itemList[viz.active_day];
        }

        var bodyVars = {
            [val]: 'metric',
            Confirmed: 'metric'
        };

        var stats = new Statistics(Filtered, bodyVars);
        Filtered.forEach(function(d){ d['Confirmed'] = +d['Confirmed']; });
        Filtered.forEach(function(d){ d[val] = +d[val]; });
        var r = stats.correlationCoefficient(val, 'Confirmed');
        console.log(r);
        const result =r.correlationCoefficient.toFixed(2);
        const bar = create_bar(result,140);
        let title="";
        let short="";
        switch (val) {
            case 'Grocery & pharmacy':
                short = "Grocery and Pharmacy Mobility";
                title ='Mobility trends for grocery and pharmacies. The data is relative to the baseline which is the median value, for the corresponding day of the week, during the 5-week period Jan 3–Feb 6, 2020.';
                break;
            case 'IncomeIneq':
                short = "Gini Index";
                title ='Gini Index of Income equality 0 is perfect equality 1 is perfect inequality relative to confirmed cases';
                break;
            case 'EuropePop10k':
                short = "European Population per 10k";
                title ='Number of people born in Europe per 10k people relative to confirmed cases';
                break;
            case 'AsiaPop10k':
                title ='Number of people born in Asia per 10k relative to confirmed cases';
                short = "Asian Population (10k)";
                break;
            case 'insured35to64_per10k':
                short = "Insured 35-64 year olds(10K)";
                title ='Number of people insured(35 to 64) per 10k relative to confirmed cases';
                break;
            case 'white10k':
                title ='Number of white people per 10k relative to confirmed cases';
                short = "'White' people(10k)";
                break;
            case 'med_age':
                title ='The median age of the all counties relative to confirmed cases';
                short = "Median age";
                break;
            case 'bachelor_degreeM_per10k':
                title ="Men with bachelor's degrees per-10k relative to confirmed case";
                short = "Men with a bachelor's(10k)";
                break;
            case 'UrbanPer10k':
                title ="People who live in urban areas as defined by the U.S. census per 10k relative to confirmed case";
                short = "Urbanites(10k)";
            case 'Residential':
                short = "Residential Mobility";
                title ="Mobility trends for places of residence.The data is relative to the baseline which is the median value, for the corresponding day of the week, during the 5-week period Jan 3–Feb 6, 2020.";
                break;
            case 'Workplace':
                short = "Workplace Mobility";
                title ="Mobility trends for places of workplaces. The data is relative to the baseline which is the median value, for the corresponding day of the week, during the 5-week period Jan 3–Feb 6, 2020.";
                break;
            case 'perCapitaIncome':
                short = "Per Capita Income";
                title="Per Capita Income ";
                break;
            case 'Retail & recreation':
                short = "Retail & recreational Mobility";
                title="Mobility trends for places like restaurants cafes, shopping centers, theme parks,museums, libraries, and movie theaters. The data is relative to the baseline which is the median value, for the corresponding day of the week, during the 5-week period Jan 3–Feb 6, 2020.";
                break;
        }
        out_str+= "<div class='corr' title ='" + title + "'><div class='cor-val'>" +  short+ "</div><span class='res-val'>" + result + "</span>" + bar + "</div>";
    });
    out_str+="</div>";

    return out_str

}

function get_data(day_num){
    viz.itemList[day_num] = [];
    let the_day = parseInt(viz.start_day)+day_num;
    let formattedDay = null;
    let formattedMonth = null;
    //const days_left_in_month = viz.days_in_month-viz.start_day;
    if (the_day>viz.days_in_month){
        formattedMonth = ("0" + (parseInt(viz.start_month)+1)).slice(-2);
        the_day = (the_day-parseInt(viz.days_in_month));
        formattedDay = ("0" + the_day).slice(-2);
    }
    else{
        formattedDay = ("0" + the_day).slice(-2);
        formattedMonth = ("0" + viz.start_month).slice(-2);
    }
    let goog_str="";
    if(parseInt(formattedMonth)>4 ||  parseInt(formattedDay)>5){
        goog_str="/google-data/" + "2020-03-29.csv";
    }
    else{
        goog_str="/google-data/" + "2020-" + formattedMonth + "-" + formattedDay + ".csv";
    }
    Promise.all([
        d3.csv("county_fips_revised.csv"),
        d3.csv("https://raw.githubusercontent.com/tomquisel/covid19-data/master/data/csv/" + "2020-" + formattedMonth + "-" + formattedDay + ".csv"),
        d3.csv(goog_str),
    ]).then(function(files) {
        // files[0] will contain file1.csv
        // files[1] will contain file2.c
        files[1].forEach(function(cvItem) {    ///new RegExp('/contact\\b', 'g').test(href)
            //const regexp = new RegExp(cvItem.county_name, 'i');
            const result = files[0].filter(fipsItem => fipsItem.State== cvItem.State_Name  && new RegExp(cvItem.County_Name, 'i').test(fipsItem.County));
            if (result[0]){
                //lets pad here move to input file in future
                const county_pad = paddy(result[0].county, 3);
                const state_pad =  paddy(result[0].state, 2);
                result[0].id = "05000US"+ state_pad+county_pad;
                //AsiaPop10k <- ((acs_Data$JWOE047/acs_Data$JWAE001)*10000)
                cvItem.Confirmed = parseFloat(cvItem.Confirmed);
                const tParser = d3.timeParse("%m-%d-2020");
                result[0].daynum= day_num;
                result[0].date = tParser;
                result[0].day = formattedMonth + "-" + formattedDay+"-2020";
                cvItem.Death = parseFloat(cvItem.Death);
                cvItem.Fatality_Rate = parseFloat(cvItem.Fatality_Rate);
                result[0].TotalPop = parseFloat(result[0].TotalPop);
                result[0].ConfirmedPer10K=((result[0].TotalPop/10000)/cvItem.Confirmed);
                //result[0].ConfirmedPer10K=Number(((((result[0].Confirmed/result[0].TotalPop)*10000) * 100) / 100).toFixed(3));
                result[0].TotalPop = parseFloat(result[0].TotalPop);
                result[0].IncomeIneq = parseFloat(result[0].IncomeIneq);
                result[0].med_age = parseFloat(result[0].med_age);
                result[0].AsiaPop10k = parseFloat(result[0].AsiaPop10k);
                result[0].white10k = parseFloat(result[0].white10k);
                result[0].EuropePop10k = parseFloat(result[0].EuropePop10k);
                result[0].perCapitaIncome = parseFloat(result[0].perCapitaIncome);
                result[0].bachelor_degreeM_per10k = parseFloat(result[0].bachelor_degreeM_per10k);
                result[0].UrbanPer10k = parseFloat(result[0].UrbanPer10k);
                ///add ga data
                const result2 = files[2].filter(function(mItem) {
                    return mItem.fips == result[0].fips
                });
                if(result2[0]){
                    result[0].Residential = (result2[0] !== undefined) ? parseFloat(result2[0].Residential) : null;
                    result[0]['Grocery & pharmacy'] = (result2[0] !== undefined) ? parseFloat(result2[0]['Grocery & pharmacy']) : null;
                    result[0]['Retail & recreation'] = (result2[0] !== undefined) ? parseFloat(result2[0]['Retail & recreation']) : null;
                    result[0].Workplace = (result2[0] !== undefined) ? parseFloat(result2[0].Workplace): null;
                    result[0].Workplace_map = (result2[0] !== undefined) ? parseFloat(result2[0].Workplace)+100: 0;
                }
                else{
                    result[0]['Grocery & pharmacy']=null;
                    result[0]['Retail & recreation']=null;
                    result[0].Workplace =null;
                    result[0].Workplace_map = 0;
                    result[0].Residential=null;
                }
                Object.assign(result[0],cvItem);
                viz.itemList[day_num].push(result[0]);
            }
            else{
                console.log(cvItem.County_Name + " " + cvItem.State_Name + " Not Found");
            }
            console.log("done");

        });
        return(day_num)

    }).then(function (day_num) {
        let day_now=null;
        let month_now=null;
        if (viz.start_day+day_num > viz.days_in_month){
            month_now = viz.start_month+1;
            day_now = (parseInt(viz.start_day)+day_num) - viz.days_in_month;
        }
        else{
            month_now = viz.start_month;
            day_now = parseInt(viz.start_day)+day_num;
        }
        $("#days .dn-"+day_num).fadeIn();
       // $("#days .c1").append("<a class='days' data-type='std' data-day='" + day_num +  "'  href='#'>View map for "+  month_now + "/" + day_now +  "</a></br>");
    })
        .then(function (day_num) {


    });

}