/*
    Topotool
    - Description: Tool to collect and see what data is available through Topomapper
    - Version: 1.0 (29 Mar 2018)
*/

var request = require('request');
var unique = require('array-unique');
var chalk = require('chalk');

var config = require('./config.json');
var baseURL = 'https://www.bryanabsmith.com/topomapper/datafiles/';

var df = config.dataFiles;
var showDesc = config.showDesc;

var wholeList = [];
var wholeRefs = [];

var chartData = [];

function getData(dataFile) {
    var count = 0;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
    return new Promise(resolve => {
        var names = [];
        request(baseURL + dataFile + '.json', function (error, response, body) {
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
        });
    });
}

function parsedData(dataFile, parseKey, parseValue) {
    var count = 0;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
    return new Promise(resolve => {
        var names = [];
        request(baseURL + dataFile + '.json', function (error, response, body) {
            var parsed = JSON.parse(body);

            while (true) {
                try {
                    if (parseKey == 'toponym') {
                        if (parsed.features[count].properties.name.indexOf(parseValue) > -1) {
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
                        }
                    } else if (parseKey == 'desc') {
                        if (parsed.features[count].properties.description.indexOf(parseValue) > -1) {
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
                        }
                    }
                    
                    count++;
                } catch (TypeError) {
                    break;
                }
            }
            resolve(unique(names).length);
        });
    });
}


async function getAllData() {
    for (var x = 0; x < df.length; x++) {
        var y = await getData(df[x]);
    }
    console.log([unique(wholeList).sort(), unique(wholeRefs).sort()])
}

async function getSomeData(splitArray) {
    for (var x = 0; x < splitArray.length; x++) {
        var y = await getData(splitArray[x]);
    }
    console.log([unique(wholeList).sort(), unique(wholeRefs).sort()])
}

async function getParsedData(key, value) {
    for (var x = 0; x < df.length; x++) {
        var y = await parsedData(df[x], key, value);
    }
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
console.log(process.argv[4])

if (params[2] == '--all') { getAllData(); }
else if (params[2] == '--some') { getSomeData(params[3].split(',')) }
else if (params[2] == '--parsed') { getParsedData(params[3], params[4]) }
else if (params[2] == '--help') { help() }
else { console.log('Command not recognized.') }