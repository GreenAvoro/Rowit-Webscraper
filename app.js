const needle = require('needle')
const cheerio = require('cheerio')

var fs = require('fs')

const url = "http://rowit.nz/mads2019/results?en=47&dn=1&tr=f"

const url2 = "http://rowit.nz/niss2019/results?en=47#e47-h"

let currentComp = []
let oldComp = []

needle.get(url, (err, res) => {
    if (err) throw err
    var $ = cheerio.load(res.body)
    $('.result-details').each(function () {
        let crew_members = $(this).find(".cardCrewMembers a")

        currentComp.push([
            $(crew_members[0]).text(),
            $(crew_members[1]).text()
        ])
    })


    //A previous event to check through all Finals
    needle.get(url2, (err, res) => {
        if (err) throw err
        var $ = cheerio.load(res.body)
        $('.result-table').each(function () {
            if ($(this).find("thead tr th a").text() == "A Final" || $(this).find("thead tr th a").text() == "B Final" ) {
                $(this).find('.result-details').each(function () {
                    var crew_members = $(this).find(".cardCrewMembers a")
                    var race_time = $(this).find(".resultTimeLink span:nth-child(2)").text()
                    var placing = $(this).find(".resultPlace .resultPlaceLink span:first-child").text()
                    oldComp.push([
                        $(crew_members[0]).text(),
                        $(crew_members[1]).text(),
                        race_time,
                        placing

                    ])
                })
            }
        })
        console.log(oldComp)
        currentComp.forEach(crew => {
            oldComp.forEach(old_crew => {
                if (old_crew.includes(crew[0]) && old_crew.includes(crew[1])) {
                    crew.push(old_crew[2])//Race Time
                    crew.push(old_crew[3])//Race Placing
                }
            })
            if (crew.length <= 2) {
                crew.push("N/A")
                crew.push("N/A")

            }
        })
        console.log(currentComp)
    })
})



