window.onload = function() {
    var $averages = $('#averages');
    var averages = JSON.parse($averages.text());

    $.fn.dataTable.ext.errMode = 'none';
    $('#average-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('pit-table: ', message);
    }).DataTable({
        data: averages,
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
                data: 'teamNumber',
                title: 'Team'
            },
            {
                data: 'startingLevel',
                title: 'Starting Level',
                defaultContent: 0
            },
            {
                data: 'crossedBaseline',
                title: 'Crossed Baseline',
                defaultContent: 0
            },
            {
                data: 'sandstormHatches',
                title: 'Sandstorm Hatches',
                defaultContent: 0
            },
            {
                data: 'sandstormCargo',
                title: 'Sandstorm Cargo',
                defaultContent: 0
            },
            {
                data: 'teleopCargoshipCargo',
                title: 'Cargoship Cargo',
                defaultContent: 0
            },
            {
                data: 'teleopRocket1Cargo',
                title: 'Rocket 1 Cargo',
                defaultContent: 0
            },
            {
                data: 'teleopRocket2Cargo',
                title: 'Rocket 2 Cargo',
                defaultContent: 0
            },
            {
                data: 'teleopRocket3Cargo',
                title: 'Rocket 3 Cargo',
                defaultContent: 0
            },
            {
                data: 'teleopDroppedCargo',
                title: 'Dropped Cargo',
                defaultContent: 0
            },
            {
                data: 'cargoPickupTime',
                title: 'Cargo Pickup Time',
                defaultContent: 0
            },
            {
                data: 'cargoDropoffTime',
                title: 'Cargo Dropoff Time',
                defaultContent: 0
            },
            {
                data: "cargoCycleTime",
                title: "Cargo Cycle Time",
                defaultContent: 0
            },
            {
                data: 'cargoSuccessPercent',
                title: 'Cargo Success Percent',
                defaultContent: 0
            },
            {
                data: "cargoEffectiveness",
                title: "Cargo Effectiveness",
                defaultContent: 0
            },
            {
                data: 'totalCargo',
                title: 'Total Cargo',
                defaultContent: 0
            },
            {
                data: 'teleopCargoshipHatch',
                title: 'Cargoship Hatch',
                defaultContent: 0
            },
            {
                data: 'teleopRocket1Hatch',
                title: 'Rocket 1 Hatch',
                defaultContent: 0
            },
            {
                data: 'teleopRocket2Hatch',
                title: 'Rocket 2 Hatch',
                defaultContent: 0
            },
            {
                data: 'teleopRocket3Hatch',
                title: 'Rocket 3 Hatch',
                defaultContent: 0
            },
            {
                data: 'teleopDroppedHatch',
                title: 'Dropped Hatch',
                defaultContent: 0
            },
            {
                data: 'hatchPickupTime',
                title: 'Hatch Pickup Time',
                defaultContent: 0
            },
            {
                data: 'hatchDropoffTime',
                title: 'Hatch Dropoff Time',
                defaultContent: 0
            },
            {
                data: "hatchCycleTime",
                title: "Hatch Cycle Time",
                defaultContent: 0
            },
            {
                data: 'hatchSuccessPercent',
                title: 'Hatch Success Percent',
                defaultContent: 0
            },
            {
                data: "hatchEffectiveness",
                title: "Hatch Effectiveness",
                defaultContent: 0
            },
            {
                data: 'totalHatch',
                title: 'Total Hatch',
                defaultContent: 0
            },
            {
                data: 'climbingDuration',
                title: 'Climbing Duration',
                defaultContent: 0
            },
            {
                data: 'pointsEarned',
                title: 'Points Earned',
                defaultContent: 0
            },
            {
                data: 'climbingType',
                title: 'Climbing Type',
                defaultContent: 0
            },
            {
                data: 'climbingGaveAssistance',
                title: 'Climbing Gave Assistance',
                defaultContent: 0
            },
            {
                data: 'climbingGotAssistance',
                title: 'Climbing Got Assistance',
                defaultContent: 0
            },
            {
                data: 'speed',
                title: 'Speed',
                defaultContent: 0
            },
            {
                data: 'stability',
                title: 'Stability',
                defaultContent: 0
            },
            {
                data: 'driverSkill',
                title: 'Driver Skill',
                defaultContent: 0
            },
            {
                data: 'defence',
                title: 'Defence',
                defaultContent: 0
            },
            {
                data: 'anythingBreak',
                title: 'Anything Break',
                defaultContent: 0
            },
            {
                data: 'dead',
                title: 'Dead',
                defaultContent: 0
            }
        ]
    })
    $('#yaxis').on('change', function (e) {
        var ctx = document.getElementById("average-chart");
        if (window.averageChart) {
            averageChart.destroy();
        }
        window.averageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $('#average-table').DataTable().column(0).data().toArray(),
                datasets: [{
                    label: $('#average-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                    data: $('#average-table').DataTable().column($('#yaxis').val()).data().toArray()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: $('#average-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Team'
                        }
                    }]
                }
            }
        })
    })
}