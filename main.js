
const config_new = {
    groupBy: "id",
    label: function(d) {
        var text = "<b class='p-head'>"+ d.County + "</b><span class='p-other'></br>Confirmed: " + d.Confirmed + "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death +  "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + "</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>No Insur 35-64 10k: " + d.insured35to64_per10k + "</span>" ;
        return "" + text;
    },
    ocean: "transparent",
    projection: "geoAlbersUsa",
    topojson: "https://d3plus.org/topojson/counties.json",
    type: "Geomap"
};

var viz = {
    itemList:[],
    start_day: "3",
    start_month: "14",
    number_days:0,
    primary_var:"Confirmed",
    active_day: 0,
    active_state:0,
    color_range:0,
};

const map = new d3plus.Geomap()
    .config(config_new)
    .data(viz.itemList[0])
    .colorScale("Confirmed");

///////////////////////////////////////////////
/////////////// Jquery Section ////////////////
///////////////////////////////////////////////

$(document).ready(function(){
    map
        .select('#viz')
        .render();

    $( document ).tooltip();

    $('#days').on('click', 'a.days', function() {
        const click_day = parseInt($(this).data( "day" ));
        const primary_var = $("input[name='my_options']:checked").val();
        let test_arr =[0,viz.color_range];

        viz.active_day=click_day;
        $("a.days").removeClass("active");
        // $(".tab").addClass("active"); // instead of this do the below
        $(this).addClass("active");

        if(primary_var=='Percent_Change'){
            new Promise(function(fulfill, reject){
                //do something for 5 second
                fulfill(delta());
            }).then(function(result){
                map
                    .data(viz.itemList[viz.active_day])
                    .label(function(d) {
                        var text =  "<b class='p-head'>"+ d.County + "</b><span class='p-other'>" + "</br>% Change: "+ d.Percent_Change +"</br>Confirmed: " + d.Confirmed +"</br>Previous Confirmed: "+ d.conf +  "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death + "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + "</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>UnInsured 35to64 10k: " + d.insured35to64_per10k + "</span>" ;
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
            });
        }
        else{
            map
                .data(viz.itemList[viz.active_day])
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


    $( "#slider-range" ).slider({
        range: true,
        min: new Date('2020.03.14').getTime() / 1000,
        max: new Date().getTime() / 1000,
        step: 86400,
        values: [ new Date('2020.03.14').getTime() / 1000, new Date('2020.03.14').getTime() / 1000 ],
        slide: function( event, ui ) {
            const start_date = new Date(ui.values[ 0 ] *1000);
            const end_date= new Date(ui.values[ 1 ] *1000);
            const start_month = start_date.getUTCMonth() + 1; //months from 1-12
            const start_day = start_date.getUTCDate(); + 1; //months from 1-12
            viz.start_day=start_day;
            viz.start_month=start_month;
            const diffTime = Math.abs(start_date - end_date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            viz.number_days= diffDays;
            if()
            $( "#amount" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + end_date.toDateString() );
        }
    });

    $( "#amount" ).val( (new Date($( "#slider-range" ).slider( "values", 0 )*1000).toDateString()) +
        " - " + (new Date($( "#slider-range" ).slider( "values", 1 )*1000)).toDateString());


    $("#test").button().click(function(){

        $( "#corr-res" ).html(corr_test(viz.active_day));

    });

    //    button click
    $("#btnSubmit").button().click(function(){
        //$('#viz').empty();
        for (i = 0; i < viz.number_days; i++) {
            get_data(i);
            let day_now = parseInt(viz.start_day)+i;
            $("#days").append("<a class='days' data-day='" + i +  "'  href='#'>View map for "+ viz.start_month + "/" + day_now +  "</a></br>");
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
            $("#slider").slider('option',{min: 0, max: 3000,step: 10});
        }

    });

});

///////////////////////////////////////////////
/////////////// JS Section ////////////////
///////////////////////////////////////////////


function getAllIndexes(arr) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] == null)
            indexes.push(i);
    return indexes;
}

d3.csv("us-state-fips.csv", function(error, data) {
    var select = d3.select("#states")
        .append("div")
        .append("select")

    select
        .on("change", function(d) {
            selected_state = d3.select(this).property("value");
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

    viz.itemList[0].forEach(function(d){ d['Confirmed'] = +d['Confirmed']; });
    viz.itemList[viz.active_day].forEach(function(d){ d['Confirmed'] = +d['Confirmed']; });

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
        acc[id] = { id, Confirmed_tot: (acc[id] ? acc[id].Confirmed_tot : 0) + Confirmed, conf:(acc[id] ? acc[id].Confirmed_tot : 0) , conf2: Confirmed,Percent_Change: ((Confirmed - (acc[id] ? acc[id].Confirmed_tot : 0)) /(acc[id] ? acc[id].Confirmed_tot : .01))*100};
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

    console.log(merged);


}
/////end jquery

function corr_test(the_day){
    let testArr=["IncomeIneq","EuropePop10k","AsiaPop10k","insured35to64_per10k","white10k","med_age"];

    let out_str="<div class='corr-rs'>";
    testArr.forEach(function(number, i) {
        let val = testArr[i];
        let Confirmed= null;
        let val1 = null
        let Filtered = null;
        if (viz.active_state !=0){
            Filtered = itemList[viz.active_day].filter(function (el) {
                return el.state == parseInt(selected_state);
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
        out_str+= val + ": " + result + " </br>";
    });
    out_str+="</div>";

    return out_str

}



function get_data(day_num){
    viz.itemList[day_num] = [];
    //curr_day
    d3.csv("county_fips_revised.csv", function(fipsData) {
        let the_day = parseInt(viz.start_day)+day_num;
        const formattedDay = ("0" + the_day).slice(-2);
        const formattedMonth = ("0" + viz.start_month).slice(-2);
        d3.csv("https://raw.githubusercontent.com/tomquisel/covid19-data/master/data/csv/" + "2020-" + formattedMonth + "-" + formattedDay + ".csv" , function(cvData) {
            cvData.forEach(function(cvItem) {    ///new RegExp('/contact\\b', 'g').test(href)
                //const regexp = new RegExp(cvItem.county_name, 'i');
                const result = fipsData.filter(fipsItem => fipsItem.State== cvItem.State_Name  && new RegExp(cvItem.County_Name, 'i').test(fipsItem.County));
                if (result[0]){
                    //lets pad here move to input file in future
                    const county_pad = paddy(result[0].county, 3);
                    const state_pad =  paddy(result[0].state, 2);
                    result[0].id = "05000US"+ state_pad+county_pad;
                    //AsiaPop10k <- ((acs_Data$JWOE047/acs_Data$JWAE001)*10000)
                    cvItem.Confirmed = parseFloat(cvItem.Confirmed);
                    cvItem.Death = parseFloat(cvItem.Death);
                    cvItem.Fatality_Rate = parseFloat(cvItem.Fatality_Rate);
                    result[0].TotalPop = parseFloat(result[0].TotalPop);
                    result[0].ConfirmedPer10K=((result[0].TotalPop/10000)/cvItem.Confirmed);
                    //result[0].ConfirmedPer10K=Number(((((result[0].Confirmed/result[0].TotalPop)*10000) * 100) / 100).toFixed(3));
                    Object.assign(result[0],cvItem);
                    result[0].TotalPop = parseFloat(result[0].TotalPop);
                    result[0].IncomeIneq = parseFloat(result[0].IncomeIneq);
                    result[0].med_age = parseFloat(result[0].med_age);
                    result[0].AsiaPop10k = parseFloat(result[0].AsiaPop10k);
                    result[0].white10k = parseFloat(result[0].white10k);
                    result[0].EuropePop10k = parseFloat(result[0].EuropePop10k);
                    viz.itemList[day_num].push(result[0]);
                }
                else{
                    console.log(cvItem.County_Name + " " + cvItem.State_Name + " Not Found");
                }
                console.log("done");

            });
            //alert("done"+ + "2020-" + formattedMonth + "-" + formattedDay + ".csv")
        });
    });
}