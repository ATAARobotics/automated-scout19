window.onload = function () {
    var $red = $('#red');
    var red = JSON.parse($red.text());
    var $blue = $('#blue');
    var blue = JSON.parse($blue.text());
    $.fn.dataTable.ext.errMode = 'none';
    
    $('#red-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('red-table: ', message);
    }).removeAttr('width').DataTable({
        data: red,
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
    $('#red-table').on('column-visibility.dt', function (e, settings, column, state) {
        for (var i = 0; i < red.length; i++) {
            $('#red-table').DataTable().draw()
            $(`td.sorting_1:contains(${red[i]._id})`).eq(1).parent().css("height", $(`td.sorting_1:contains(${red[i]._id})`).eq(0).height() + 16);
        }
    });

    $('#blue-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('blue-table: ', message);
    }).removeAttr('width').DataTable({
        data: blue,
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
    $('#blue-table').on('column-visibility.dt', function (e, settings, column, state) {
        for (var i = 0; i < blue.length; i++) {
            $('#blue-table').DataTable().draw()
            $(`td.sorting_1:contains(${blue[i]._id})`).eq(1).parent().css("height", $(`td.sorting_1:contains(${blue[i]._id})`).eq(0).height() + 16);
        }
    });


}