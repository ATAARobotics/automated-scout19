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
        scrollY: "400px",
        scrollCollapse: true,
        colReorder: true,
        scrollX: true,
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel'
        ],
        columns: [
            {
                data: "_rev",
                title: "Revision",
            },
            {
                data: "scoutName",
                title: "Scout Name",
                defaultContent: "No Name"
            },
            {
                data: "robotAppearance",
                title: "Appearance",
                defaultContent: 0
            },
            {
                data: "groundIntake",
                title: "Ground Intake",
                defaultContent: 0
            },
            {
                data: "climbLevel",
                title: "Climb Level",
                defaultContent: 0
            },
            {
                data: "cargoLevel",
                title: "Cargo Level",
                defaultContent: 0
            },
            {
                data: "hatchLevel",
                title: "Hatch Level",
                defaultContent: 0
            },
            {
                data: "robotDone",
                title: "Done",
                defaultContent: 0
            },
            {
                data: "robotBroken",
                title: "Broken",
                defaultContent: 0
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
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel',
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
                title: "Scout Name",
                defaultContent: "No Name"
            },
            {
                data: "startingLevel",
                title: "Starting Level",
                defaultContent: 0
            },
            {
                data: "crossedBaseline",
                title: "Baseline",
                defaultContent: 0
            },
            {
                data: "sandstormHatches",
                title: "Sandstorm Hatches",
                defaultContent: 0
            },
            {
                data: "sandstormCargo",
                title: "Sandstorm Cargo",
                defaultContent: 0
            },
            {
                data: "teleopCargoshipCargo",
                title: "Cargoship Cargo",
                defaultContent: 0
            },
            {
                data: "teleopRocket1Cargo",
                title: "Rocket 1 Cargo",
                defaultContent: 0
            },
            {
                data: "teleopRocket2Cargo",
                title: "Rocket 2 Cargo",
                defaultContent: 0
            },
            {
                data: "teleopRocket3Cargo",
                title: "Rocket 3 Cargo",
                defaultContent: 0
            },
            {
                data: "teleopDroppedCargo",
                title: "Dropped Cargo",
                defaultContent: 0
            },
            {
                data: "teleopCargoshipHatch",
                title: "Cargoship Hatch",
                defaultContent: 0
            },
            {
                data: "teleopRocket1Hatch",
                title: "Rocket 1 Hatch",
                defaultContent: 0
            },
            {
                data: "teleopRocket2Hatch",
                title: "Rocket 2 Hatch",
                defaultContent: 0
            },
            {
                data: "teleopRocket3Hatch",
                title: "Rocket 3 Hatch",
                defaultContent: 0
            },
            {
                data: "teleopDroppedHatch",
                title: "Dropped Hatch",
                defaultContent: 0
            },
            {
                data: "climbingType",
                title: "Climb Level",
                defaultContent: 0
            },
            {
                data: "climbingGaveAssistance",
                title: "Gave Climbing Assistance",
                defaultContent: 0
            },
            {
                data: "climbingGotAssistance",
                title: "Got Climbing Assistance",
                defaultContent: 0
            },
            {
                data: "speed",
                title: "Speed",
                defaultContent: 0
            },
            {
                data: "stability",
                title: "Stability",
                defaultContent: 0
            },
            {
                data: "driverSkill",
                title: "Driver Skill",
                defaultContent: 0
            },
            {
                data: "defence",
                title: "Defence",
                defaultContent: 0
            },
            {
                data: "anythingBreak",
                title: "Broken",
                defaultContent: 0
            },
            {
                data: "dead",
                title: "Dead",
                defaultContent: 0
            },
            {
                data: "totalCargo",
                title: "Total Cargo",
                defaultContent: 0
            },
            {
                data: "totalHatch",
                title: "Total Hatch",
                defaultContent: 0
            },
            {
                data: "averageCargoPickupTime",
                title: "Cargo Pickup Time",
                defaultContent: 0
            },
            {
                data: "averageCargoDropoffTime",
                title: "Cargo Dropoff Time",
                defaultContent: 0
            },
            {
                data: "averageHatchPickupTime",
                title: "Hatch Pickup Time",
                defaultContent: 0
            },
            {
                data: "averageHatchDropoffTime",
                title: "Hatch Dropoff Time",
                defaultContent: 0
            },
            {
                data: "hatchCycleTime",
                title: "Hatch Cycle Time",
                defaultContent: 0
            },
            {
                data: "cargoCycleTime",
                title: "Cargo Cycle Time",
                defaultContent: 0
            },
            {
                data: "climbingDuration",
                title: "Climb Time",
                defaultContent: 0
            },
            {
                data: "cargoSuccessPercent",
                title: "Cargo Success",
                defaultContent: 0
            },
            {
                data: "hatchSuccessPercent",
                title: "Hatch Success",
                defaultContent: 0
            },
            {
                data: "cargoEffectiveness",
                title: "Cargo Effectiveness",
                defaultContent: 0
            },
            {
                data: "hatchEffectiveness",
                title: "Hatch Effectiveness",
                defaultContent: 0
            },
            {
                data: "pointsEarned",
                title: "Points Earned",
                defaultContent: 0
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
                labels: $('#match-table').DataTable().column(0).data().toArray(),
                datasets: [{
                    label: $('#match-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                    data: $('#match-table').DataTable().column($('#yaxis').val()).data().toArray()
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