const needle = require('needle')
const cheerio = require('cheerio')

var fs = require('fs')

module.exports = function (req, res, next) {
    console.log("Inside Scrapper")

    // const url = "http://rowit.nz/mads2019/results?en=47&dn=1&tr=f"

    // const url2 = "http://rowit.nz/niss2019/results?en=47#e47-h"
    const urls = req.body

    let currentComp = []
    let oldComp = []

    try {
        needle.get(urls[0], (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            var $ = cheerio.load(res.body)

            $('.result-details').each(function () {
                let crew_members = $(this).find(".cardCrewMembers a")
                var to_push = [
                    [
                        $(crew_members[0]).text(),
                        $(crew_members[1]).text()
                    ]
                ]
                currentComp.push(to_push)
            })
            console.log("getting to end of url1")
            urls.forEach((url, i) => {
                console.log(`URL: ${url}\n index: ${i}`)
                if (i !== 0) {
                    //A previous event to check through all Finals
                    needle.get(url, (err, res) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                        var $ = cheerio.load(res.body)
                        $('.result-table').each(function () {
                            if ($(this).find("thead tr th a").text() == "A Final" || $(this).find("thead tr th a").text() == "B Final") {
                                $(this).find('.result-details').each(function () {
                                    var crew_members = $(this).find(".cardCrewMembers a")
                                    var race_time = $(this).find(".resultTimeLink span:nth-child(2)").text()
                                    var placing = $(this).find(".resultPlace .resultPlaceLink span:first-child").text()
                                    var to_push = [
                                        $(crew_members[0]).text(),
                                        $(crew_members[1]).text(),
                                        race_time,
                                        placing
                                    ]
                                    oldComp.push(to_push)
                                })
                            }
                        })
                        currentComp.forEach(crew => {
                            oldComp.forEach(old_crew => {
                                if (old_crew.includes(crew[0][0]) && old_crew.includes(crew[0][1])) {
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
                        req.rowers = currentComp
                        next()
                    })
                }
            })
        })

    } catch (err) {
        res.status(400).send(err)
    }
}


