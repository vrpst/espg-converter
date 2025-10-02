import fs from 'fs'
import {LatLon} from 'geodesy/osgridref.js';
const ifn = ["cau"]
const ofn = ["test2"]
for (let a=0; a<ifn.length; a++) {
    let geojson = fs.readFileSync('./if/' + ifn[a] + '.geojson', function(err, data){})
    let geojsonObject = JSON.parse(geojson)
    let gj3 = JSON.parse(fs.readFileSync('./if/' + ifn[a] + '.geojson', function(err, data){}))
    gj3 = gj3['features']
    let gj2 = geojsonObject['features']
    for (let i=0; i<gj2.length; i++) {
        console.log(i+1, '/', gj2.length)
        for (let j=0; j<gj2[i]["geometry"]["coordinates"].length; j++) {
            for (let k=0; k<gj2[i]["geometry"]["coordinates"][j].length; k++) {
                for (let l=0; l<gj2[i]["geometry"]["coordinates"][j][k].length; l++) {
                    let m = null
                    let espg4326 = null
                    let gridref = null
                    if (Array.isArray(gj2[i]["geometry"]["coordinates"][j][k][l])) {
                        //console.log("DEEPER", gj2[i]["geometry"]["coordinates"][j][k][0])
                        m = gj2[i]["geometry"]["coordinates"][j][k][l]
                    } else {
                        m = gj2[i]["geometry"]["coordinates"][j][k]
                    }
                    try {
                        espg4326 = new LatLon(m[1], m[0]);
                        gridref = espg4326.toOsGrid();
                        if (Array.isArray(gj2[i]["geometry"]["coordinates"][j][k][l])) {
                            gj3[i]["geometry"]["coordinates"][j][k][l] = [gridref['easting'], gridref['northing']]
                        } else {
                            //console.log("NUMBER")
                            gj3[i]["geometry"]["coordinates"][j][k] = [gridref['easting'], gridref['northing']]
                        }
                    } catch (error) {
                        console.log(error)
                    }    
                }
            }
        }
    }
    let gj4 = geojsonObject
    gj4['features'] = gj3
    gj4['crs']['properties']['name'] = "ESPG:27700"
    gj4 = JSON.stringify(gj4)
    fs.writeFileSync('./of/' + ofn[a] + '.geojson', gj4)
}


// SEE https://www.movable-type.co.uk/scripts/latlong-os-gridref.html