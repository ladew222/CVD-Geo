
const config_new = {
    groupBy: "id",
    label: function(d) {
        var text = "<b class='p-head'>"+ d.County + "</b><span class='p-other'></br>Confirmed: " + d.Confirmed + "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death +  "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + "</br>Gini Index: " + d.IncomeIneq + "</BR>Grocery Mobility: " + d['Grocery & pharmacy'] +  "</BR>Residential Mobility: " + d['Grocery & pharmacy'] + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>No Insur 35-64 10k: " + d.insured35to64_per10k + "</span>" ;
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
    start_month: "4",
    number_days:7,
    primary_var:"Confirmed",
    active_day: 0,
    active_state:0,
    color_range:0,
    days_in_month: 30,
    mobility_data: false,
};

const map = new d3plus.Geomap()
    .config(config_new)
    .data(viz.itemList[0])
    .colorScale("Confirmed");



function build_map(primary_var){


    if(viz.mobility_data==true){
        map.label(function(d) {
            var text =  "<b class='p-head'>"+ d.County + "</b><span class='p-other'>" + "</br>Confirmed: "+ d.Confirmed + "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death + "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + "</br>Residential Mobility: " + d.Residential + "<BR/>Workplace Mobility: "+ d.Workplaces + "<BR/>Retail & recreation mobility:" + d["Retail & recreation"] +"</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>UnInsured 35to64 10k: " + d.insured35to64_per10k + "</span>" ;
            return text;
        })
    }
    else{
        map.label(function(d) {
            var text =  "<b class='p-head'>"+ d.County + "</b><span class='p-other'>" + "</br>Confirmed: "+  d.Confirmed + "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death + "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop  +"</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>UnInsured 35to64 10k: " + d.insured35to64_per10k + "</span>" ;
            return text;
        })

    }
    let test_arr =[0,viz.color_range];
    if(primary_var=='Percent_Change'){
        new Promise(function(fulfill, reject){
            //do something for 5 second
            fulfill(delta());
        }).then(function(result){

            if (viz.color_range==0){

                map
                    .data(viz.itemList[viz.active_day])
                    .label(function(d) {
                        var text =  "<b class='p-head'>"+ d.County + "</b><span class='p-other'>" + "</br>% Change: "+ d.Percent_Change +"</br>Confirmed: "+ "</br>Per10K: " + d.ConfirmedPer10K + "</br> Deaths: " + d.Death + "<BR/>Fatality Rate: " + d.Fatality_Rate +  "<BR/>Population: "+ d.TotalPop + mobility+ "</br>Gini Index: " + d.IncomeIneq + "</BR>Asia born 10k: "+ d.AsiaPop10k +"</br>Europe Born 10k:  " +d.EuropePop10k + "</br>UnInsured 35to64 10k: " + d.insured35to64_per10k + "</span>" ;
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
                    .render();
            }
            else{
                map
                    .data(viz.itemList[viz.active_day])
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


}

///////////////////////////////////////////////
/////////////// Jquery Section ////////////////
///////////////////////////////////////////////https://www.d3-graph-gallery.com/graph/basic_datamanipulation.html

$(document).ready(function(){
    const start_date = new Date(new Date().getTime() - (240 * 60 * 60 * 1000));
    const end_date= new Date(new Date().getTime() - (48 * 60 * 60 * 1000));
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

    $(".two-col").on("click", "c1", function(event){
        console.log($(this).text());
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


    $( "#slider-range" ).slider({
        range: true,
        min: new Date('2020.03.14').getTime() / 1000,
        max: new Date().getTime() / 1000,
        step: 86400,
        values: [ new Date(new Date().getTime() - (240 * 60 * 60 * 1000)).getTime() / 1000, new Date(new Date().getTime() - (48 * 60 * 60 * 1000)).getTime() / 1000 ],
        slide: function( event, ui ) {
            const start_date = new Date(ui.values[ 0 ] *1000);
            const end_date= new Date(ui.values[ 1 ] *1000);
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
    $(".test").click(function(){

        get_mobile_data(0);

    });


    $("#test").button().click(function(){

        $( "#corr-res" ).html(corr_test(viz.active_day));

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
            $("#days .c1").append("<a class='days' data-type='std' data-day='" + i +  "'  href='#'>View map for "+  month_now  + "/" + day_now +  "</a></br>");
            $("#days .c2").append("<a class='days' data-type='mobile' data-day='" + i +  "'  href='#'>with Mobility Data </a></br>");
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

    });

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
    });

    console.log(merged);


}
/////end jquery

function create_bar(strength,factor)
{
    const l1 = "<svg class='bar' width=\""+ strength*factor +"\" height=\"10\">"
    let l2 = null;
    if (Math.sign(strength)==1){
        l2 ="<rect x=\"0\" y=\"0\" width=\""+ strength*(factor-5) + "\" height=\"10\" fill=\"green\" />";
    }
    else{
        strength= Math.abs(strength);
        l2 ="<rect x=\"0\" y=\"0\" width=\""+ strength*(factor-5) + "\" height=\"10\" fill=\"red\" />";
    }

    const l3 ="</svg>";
    return l1+ l2+l3;
}
function corr_test(the_day){
    let testArr=["IncomeIneq","EuropePop10k","AsiaPop10k","insured35to64_per10k","white10k","med_age","perCapitaIncome","bachelor_degreeM_per10k","perCapitaIncome","UrbanPer10k","Grocery & pharmacy","Retail & recreation"];
    if(viz.mobility_data==true){
        testArr.push("Residential","Workplaces");
    }
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
        const bar = create_bar(result,140);
        let title="";
        switch (val) {
            case 'IncomeIneq':
                title ='Gini Index of Income equality 0 is perfect equality 1 is perfect inequality';
                break;
            case 'EuropePop10k':
                title ='Number of people born in Europe per 10k';
                break;
            case 'AsiaPop10k':
                title ='Number of people born in Asia per 10k';
                break;
            case 'insured35to64_per10k':
                title ='Number of people insured(35 to 64) per 10k';
                break;
            case 'insured35to64_per10k':
                title ='Number of people insured(35 to 64) per 10k';
                break;
            case 'white10k':
                title ='Number of white people per 10k';
                break;
            case 'med_age':
                title ='Number of white people per 10k';
                break;
            case 'bachelor_degreeM_per10k':
                title ="Men with bachelor's degrees per-10k";
                break;
            case 'UrbanPer10k':
                title ="Urban per 10k";
            case 'Residential':
                title ="Residential mobility reported by google on 3-29";
                break;
            case 'Workplaces':
                title ="Workplace mobility as reported by google on 3-29";
                break;
            case 'Retail & recreation':
                title="Retail & recreation mobility as reported by google on 3-29";
                break

        }
        out_str+= "<div class='corr' title ='" + title + "'><div class='cor-val'>" +  val + ": " + result +  "</div>" + bar + "</div>";
    });
    out_str+="</div>";

    return out_str

}

function get_mobile_data(day_num){
    let new_list =[];
    d3.csv("us-state-fips.csv").then(function(data) {
        for (const mobItem of mobData) {
            const result = viz.itemList[day_num].filter(mainItem => mainItem.State_Name == mobItem.State  && new RegExp(mainItem.County_Name, 'i').test(mobItem.Region));  //mainItem.County_Name
            if (result[0]){
                mobItem.Residential= parseFloat(mobItem.Residential);
                Object.assign(result[0],mobItem);
                new_list.push(result[0]);
            }
            else{
                console.log(mobItem.State + " " + mobItem.Region + " Not Found");
            }
        }
        viz.itemList[day_num] = new_list;
        return  new_list;
    });

}

const gmb = async _ => {
    let new_list =[];
        d3.csv("mobility_report_US-3-29.csv").then(function(mobData) {
        for (const mobItem of mobData) {
            const result = viz.itemList[viz.active_day].filter(mainItem => mainItem.State_Name == mobItem.State  && new RegExp(mainItem.County_Name, 'i').test(mobItem.Region));  //mainItem.County_Name
            if(result[0]){
                mobItem.Residential = parseFloat(mobItem.Residential);
                Object.assign(result[0],mobItem);
                new_list.push(result[0]);
            }
            else{
                console.log(mobItem.State + " " + mobItem.Region + " Not Found");
            }
        }
        viz.itemList[viz.active_day] = new_list;
        return new_list;

    });
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
    Promise.all([
        d3.csv("county_fips_revised.csv"),
        d3.csv("https://raw.githubusercontent.com/tomquisel/covid19-data/master/data/csv/" + "2020-" + formattedMonth + "-" + formattedDay + ".csv"),
        d3.csv("/google-data/" + "2020-" + formattedMonth + "-" + formattedDay + ".csv"),
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
                cvItem.Death = parseFloat(cvItem.Death);
                cvItem.Fatality_Rate = parseFloat(cvItem.Fatality_Rate);
                result[0].TotalPop = parseFloat(result[0].TotalPop);
                result[0].ConfirmedPer10K=((result[0].TotalPop/10000)/cvItem.Confirmed);
                //result[0].ConfirmedPer10K=Number(((((result[0].Confirmed/result[0].TotalPop)*10000) * 100) / 100).toFixed(3));
                Object.assign(result[0],cvItem);
                result[0].fips_short = result[0].fips;
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
                const result2 = result[0].filter(function(mItem) {
                    return mItem.fips_short == result[0].fips_short
                });
                result2[0].Residential = (result2[0] !== undefined) ? result2[0].Residential : null;
                result2[0]['Grocery & pharmacy'] = (result2[0] !== undefined) ? result2[0]['Grocery & pharmacy'] : null;
                result2[0]['Retail & recreation'] = (result2[0] !== undefined) ? result2[0]['Retail & recreation'] : null;
                result2[0].Workplace = (result2[0] !== undefined) ? result[0].Workplace: null;
                viz.itemList[day_num].push(result2[0]);
            }
            else{
                console.log(cvItem.County_Name + " " + cvItem.State_Name + " Not Found");
            }
            console.log("done");
            files[2].forEach(function(gItem) {
                var result = viz.itemList[day_num].filter(function(mItem) {
                    return mItem.fips_short == gItem.fips;
                });
                //delete article.brand_id;Workplace
                viz.itemList[day_num].Residential = (result[0] !== undefined) ? result[0].Residential : null;
                viz.itemList[day_num]['Grocery & pharmacy'] = (result[0] !== undefined) ? result[0]['Grocery & pharmacy'] : null;
                viz.itemList[day_num]['Retail & recreation'] = (result[0] !== undefined) ? result[0]['Retail & recreation'] : null;
                viz.itemList[day_num].Workplace = (result[0] !== undefined) ? result[0].Workplace: null;
            });

        });

    });
}