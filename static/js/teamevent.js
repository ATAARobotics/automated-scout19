window.onload = function () {
    var $matches = $('#matches');
    var matches = JSON.parse($matches.text());
    var $pit = $('#pit');
    var pit = JSON.parse($pit.text());
    $.fn.dataTable.ext.errMode = 'none';
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    if (!pit.error) {
        document.getElementById("photo1").src = URL.createObjectURL(b64toBlob(pit[0]._attachments['photo1.jpg'].data, 'image/jpeg'));
        document.getElementById("photo2").src = URL.createObjectURL(b64toBlob(pit[0]._attachments['photo2.jpg'].data, 'image/jpeg'));
    }
    $('#pit-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('pit-table: ', message);
    }).DataTable({
        data: pit,
        paging: false,
        colReorder: true,
        scrollX: true,
        fixedHeader: true,
        columns: [
            {
                data: "_rev",
                title: "Revision",
            },
            {
                data: "scoutName",
                title: "Scout Name"
            },
            {
                data: "vision",
                title: "Vision"
            },
            {
                data: "robotAppearance",
                title: "Appearance"
            },
            {
                data: "groundIntake",
                title: "Ground Intake"
            },
            {
                data: "climbLevel",
                title: "Climb Level"
            },
            {
                data: "cargoLevel",
                title: "Cargo Level"
            },
            {
                data: "hatchLevel",
                title: "Hatch Level"
            },
            {
                data: "robotDone",
                title: "Done"
            },
            {
                data: "robotBroken",
                title: "Broken"
            },
            {
                data: "comments",
                title: "Comments",
                width: "500px"
            }
        ]
    });
    $('#match-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('match-table: ', message);
    }).removeAttr('width').DataTable({
        data: matches,
        paging: false,
        colReorder: true,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        fixedColumns: true,
        fixedHeader: true,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'colvis',
                collectionLayout: 'fixed four-column'
            }
        ],
        columns: [
            {
                data: "_id",
                title: "Match",
                type: "natural"
            },
            {
                data: "scoutName",
                title: "Scout Name"
            },
            {
                data: "startingLevel",
                title: "Starting Level"
            },
            {
                data: "crossedBaseline",
                title: "Baseline"
            },
            {
                data: "crossedBaselineTime",
                title: "Baseline Time"
            },
            {
                data: "sandstormCargoCargoship",
                title: "Sandstorm Cargo Cargoship"
            },
            {
                data: "sandstormCargoCargoshipTime",
                title: "Sandstorm Cargo Cargoship Time"
            },
            {
                data: "sandstormCargoRocket",
                title: "Sandstorm Cargo Rocket"
            },
            {
                data: "sandstormCargoRocketTime",
                title: "Sandstorm Cargo Rocket Time"
            },
            {
                data: "sandstormHatchCargoship",
                title: "Sandstorm Hatch Cargoship"
            },
            {
                data: "sandstormHatchCargoshipTime",
                title: "Sandstorm Hatch Cargoship Time"
            },
            {
                data: "sandstormHatchRocket",
                title: "Sandstorm Hatch Rocket"
            },
            {
                data: "sandstormHatchRocketTime",
                title: "Sandstorm Hatch Rocket Time"
            },
            {
                data: "teleopCargoshipCargo",
                title: "Cargoship Cargo"
            },
            {
                data: "teleopRocket1Cargo",
                title: "Rocket 1 Cargo"
            },
            {
                data: "teleopRocket2Cargo",
                title: "Rocket 2 Cargo"
            },
            {
                data: "teleopRocket3Cargo",
                title: "Rocket 3 Cargo"
            },
            {
                data: "teleopDroppedCargo",
                title: "Dropped Cargo"
            },
            {
                data: "teleopCargoshipHatch",
                title: "Cargoship Hatch"
            },
            {
                data: "teleopRocket1Hatch",
                title: "Rocket 1 Hatch"
            },
            {
                data: "teleopRocket2Hatch",
                title: "Rocket 2 Hatch"
            },
            {
                data: "teleopRocket3Hatch",
                title: "Rocket 3 Hatch"
            },
            {
                data: "teleopDroppedHatch",
                title: "Dropped Hatch"
            },
            {
                data: "climbingType",
                title: "Climb Level"
            },
            {
                data: "climbingGaveAssistance",
                title: "Gave Climbing Assistance"
            },
            {
                data: "climbingGotAssistance",
                title: "Got Climbing Assistance"
            },
            {
                data: "speed",
                title: "Speed"
            },
            {
                data: "stability",
                title: "Stability"
            },
            {
                data: "driverSkill",
                title: "Driver Skill"
            },
            {
                data: "defence",
                title: "Defence"
            },
            {
                data: "anythingBreak",
                title: "Broken"
            },
            {
                data: "dead",
                title: "Dead"
            },
            {
                data: "totalCargo",
                title: "Total Cargo"
            },
            {
                data: "totalHatch",
                title: "Total Hatch"
            },
            {
                data: "averageCargoPickupTime",
                title: "Cargo Pickup Time"
            },
            {
                data: "averageCargoDropoffTime",
                title: "Cargo Dropoff Time"
            },
            {
                data: "averageHatchPickupTime",
                title: "Hatch Pickup Time"
            },
            {
                data: "averageHatchDropoffTime",
                title: "Hatch Dropoff Time"
            },
            {
                data: "climbingDuration",
                title: "Climb Time"
            },
            {
                data: "cargoSuccessPercent",
                title: "Cargo Success"
            },
            {
                data: "hatchSuccessPercent",
                title: "Hatch Success"
            },
            {
                data: "pointsEarned",
                title: "Points Earned"
            },
            {
                width: "500px",
                data: "comments",
                title: "Comments",
            }
        ]
    });
    $('#match-table').on('column-visibility.dt', function (e, settings, column, state) {
        for (var i = 0; i < matches.length; i++) {
            $('#match-table').DataTable().draw()
            $(`td.sorting_1:contains(${matches[i]._id})`).eq(1).parent().css("height", $(`td.sorting_1:contains(${matches[i]._id})`).eq(0).height() + 16);
        }
    });
    $('#yaxis').on('change', function (e) {
        var ctx = document.getElementById("match-chart");
        if (window.matchChart) {
            matchChart.destroy();
        }
        window.matchChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $('#match-table').DataTable().column(0).data(),
                datasets: [{
                    label: $('#match-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                    data: $('#match-table').DataTable().column($('#yaxis').val()).data()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: $('#match-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Match'
                        }
                    }]
                }
            }
        })
    })
    var timeline;
    $('#timeline-select').on('change', function (e) {
        var match = matches.find(x => x._id == $('#timeline-select').val());
        var timelineArray = [];
        timelineArray.push({content: 'Sandstorm', type: 'background', start: moment('02:15.0', "mm:ss.S"), end: moment('02:30.0', "mm:ss.S")});
        if (match.crossedBaselineTime) {
            timelineArray.push({content: 'Crossed Baseline', title: match.crossedBaselineTime, start: moment(match.crossedBaselineTime, "mm:ss.S")});
        }
        if (match.sandstormCargoCargoshipTime) {
            timelineArray.push({content: "Cargo In Cargoship", title: match.sandstormCargoCargoshipTime, start: moment(match.sandstormCargoCargoshipTime, "mm:ss.S")})
        }
        if (match.sandstormCargoRocketTime) {
            timelineArray.push({content: "Cargo In Rocket", title: match.sandstormCargoRocketTime, start: moment(match.sandstormCargoRocketTime, "mm:ss.S")})
        }
        if (match.sandstormHatchCargoshipTime) {
            timelineArray.push({content: "Hatch In Cargoship", title: match.sandstormHatchCargoshipTime, start: moment(match.sandstormHatchCargoshipTime, "mm:ss.S")})
        }
        if (match.sandstormHatchRocketTime) {
            timelineArray.push({content: "Hatch In Rocket", title: match.sandstormHatchRocketTime, start: moment(match.sandstormHatchRocketTime, "mm:ss.S")})
        }
        for (var i = 0; i < match.teleopCargoTime.length; i++) {
            timelineArray.push({content: `Cargo In ${match.teleopCargoTime[i][2]}`, title: `${match.teleopCargoTime[i][0]} - ${match.teleopCargoTime[i][1]}`, start: moment(match.teleopCargoTime[i][1], "mm:ss.S"), end: moment(match.teleopCargoTime[i][0], "mm:ss.S")})
        }
        for (var i = 0; i < match.teleopHatchTime.length; i++) {
            timelineArray.push({content: `Hatch In ${match.teleopHatchTime[i][2]}`, title: `${match.teleopHatchTime[i][0]} - ${match.teleopHatchTime[i][1]}`, start: moment(match.teleopHatchTime[i][1], "mm:ss.S"), end: moment(match.teleopHatchTime[i][0], "mm:ss.S")})
        }
        if (match.climbingTime[0] && match.climbingTime[1]) {
            timelineArray.push({content: 'Climbing', title: `${match.climbingTime[0]}-${match.climbingTime[1]}`, start: moment(match.climbingTime[1], "mm:ss.S"), end: moment(match.climbingTime[0], "mm:ss.S")})  
        }
        if (timeline) {
            timeline.destroy();
        }
        var items = new vis.DataSet(timelineArray);
        var container = document.getElementById('timeline');
        timeline = new vis.Timeline(container, items, {
            min: moment('00:00.0', "mm:ss.S"),
            max: moment('02:30.0', "mm:ss.S"),
            start: moment('00:55.0', "mm:ss.S"),
            end: moment('02:30.0', "mm:ss.S"),
            zoomMax: 95000,
            showMajorLabels: false,
            zoomMin: 9000,
            timeAxis: {
                scale: 'second',
                step: 5
            },
            format: {
                minorLabels: {
                    second: 'mm:ss.S'
                }
            }
        });    
    })
}