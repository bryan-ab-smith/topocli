/*
    Topotool
    - Description: Tool to collect and see what data is available through Topomapper
    - Version: 1.0 (29 Mar 2018)
*/

var request = require('request');
var unique = require('array-unique');
var chalk = require('chalk');

var config = require('./config.json');

var df = config.dataFiles;
var showDesc = config.showDesc;

var wholeList = [];
var wholeRefs = [];

/* 
    - getData(dataFile)
    - Parameter(s):
        - dataFile - name of the JSON file to pull down and parse. The file name here is combined with the base URL (https://www.bryanabsmith.com/topomapper/--dataFile--.json)
*/
function getData(dataFile) {
    var count = 0;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
    return new Promise(resolve => {
        var names = [];
        request('https://www.bryanabsmith.com/topomapper/js/' + dataFile + '.json', function (error, response, body) {
            var parsed = JSON.parse(body);

            while (true) {
                try {
                    if (showDesc == true) {
                        wholeList.push(parsed.features[count].properties.name + ' - ' + parsed.features[count].properties.description);
                    } else {
                        wholeList.push(parsed.features[count].properties.name);
                    }
                    
                    names.push(parsed.features[count].properties.name);
                    
                    var tempRefs = parsed.features[count].properties.refs.split('<br \\>');
                    for (x in tempRefs) {
                        wholeRefs.push(tempRefs[x]);
                    }

                    count++;
                } catch (TypeError) {
                    break;
                }
            }
            resolve(unique(names).length);
            //resolve(null);
        });
    });
}

/* 
    - getAllData()
    - Parameter(s):
        - N/A
*/
async function getAllData() {
    for (var x = 0; x < df.length; x++) {
        //console.log(chalk.green('Getting ' + df[x] + '...'));
        var y = await getData(df[x]);
        //console.log(chalk.blue('--> Collected ' + y + ' toponyms.'));
    }
    /*console.log('\n\n' + chalk.yellow('Final Toponym List'));
    console.log(unique(wholeList).sort());
    console.log('\n\n' + chalk.yellow('Final Reference List'));
    console.log(unique(wholeRefs).sort());*/
    console.log([unique(wholeList).sort(), unique(wholeRefs).sort()])
}

async function getSomeData(splitArray) {
    for (var x = 0; x < splitArray.length; x++) {
        //console.log(chalk.green('Getting ' + splitArray[x] + '...'));
        var y = await getData(splitArray[x]);
        //console.log(chalk.blue('--> Collected ' + y + ' toponyms.'));
    }
    /*console.log('\n\n' + chalk.yellow('Final Toponym List'));
    console.log(unique(wholeList).sort());
    console.log('\n\n' + chalk.yellow('Final Reference List'));
    console.log(unique(wholeRefs).sort());*/
    console.log([unique(wholeList).sort(), unique(wholeRefs).sort()])
}

function help() {
    console.log(chalk.yellow('Commands:'));

    console.log(chalk.green('   --all'));
    console.log(chalk.cyan('        Get all the data available in Topomapper. Returns a 2D array: [[toponyms], [refs]].'));
    console.log(chalk.magenta('         ex. node index.js --all'))
    console.log('\n');

    console.log(chalk.green('   --some') + chalk.red(' [comma seperated list of datafiles]'));
    console.log(chalk.cyan('        Get some the data available in Topomapper. Returns a 2D array: [[toponyms], [refs]].'));
    console.log(chalk.magenta('         ex. node index.js --some atsi,pol ') + 'Returns Aboriginal and Torres Strait Islander peoples & events and political figures.')
}

var params = process.argv;

if (params[2] == '--all') { getAllData(); }
else if (params[2] == '--some') { getSomeData(params[3].split(',')) }
else if (params[2] == '--help') { help() }
else { console.log('Command not recognized.') }