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
                data: 'teamNumber',
                title: 'Team'
            },
            {
                data: 'startingLevel',
                title: 'Starting Level'
            },
            {
                data: 'crossedBaseline',
                title: 'Crossed Baseline'
            },
            {
                data: 'sandstormCargoCargoship',
                title: 'Sandstorm Cargo Cargoship'
            },
            {
                data: 'sandstormCargoRocket',
                title: 'Sandstorm Cargo Rocket'
            },
            {
                data: 'sandstormHatchCargoship',
                title: 'Sandstorm Hatch Cargoship'
            },
            {
                data: 'sandstormHatchRocket',
                title: 'Sandstorm Hatch Rocket'
            },
            {
                data: 'teleopCargoshipCargo',
                title: 'Cargoship Cargo'
            },
            {
                data: 'teleopRocket1Cargo',
                title: 'Rocket 1 Cargo'
            },
            {
                data: 'teleopRocket2Cargo',
                title: 'Rocket 2 Cargo'
            },
            {
                data: 'teleopRocket3Cargo',
                title: 'Rocket 3 Cargo'
            },
            {
                data: 'teleopDroppedCargo',
                title: 'Dropped Cargo'
            },
            {
                data: 'cargoPickupTime',
                title: 'Cargo Pickup Time'
            },
            {
                data: 'cargoDropoffTime',
                title: 'Cargo Dropoff Time'
            },
            {
                data: 'cargoSuccessPercent',
                title: 'Cargo Success Percent'
            },
            {
                data: 'totalCargo',
                title: 'Total Cargo'
            },
            {
                data: 'teleopCargoshipHatch',
                title: 'Cargoship Hatch'
            },
            {
                data: 'teleopRocket1Hatch',
                title: 'Rocket 1 Hatch'
            },
            {
                data: 'teleopRocket2Hatch',
                title: 'Rocket 2 Hatch'
            },
            {
                data: 'teleopRocket3Hatch',
                title: 'Rocket 3 Hatch'
            },
            {
                data: 'teleopDroppedHatch',
                title: 'Dropped Hatch'
            },
            {
                data: 'hatchPickupTime',
                title: 'Hatch Pickup Time'
            },
            {
                data: 'hatchDropoffTime',
                title: 'Hatch Dropoff Time'
            },
            {
                data: 'hatchSuccessPercent',
                title: 'Hatch Success Percent'
            },
            {
                data: 'totalHatch',
                title: 'Total Hatch'
            },
            {
                data: 'climbingDuration',
                title: 'Climbing Duration'
            },
            {
                data: 'pointsEarned',
                title: 'Points Earned'
            },
            {
                data: 'climbingType',
                title: 'Climbing Type'
            },
            {
                data: 'climbingGaveAssistance',
                title: 'Climbing Gave Assistance'
            },
            {
                data: 'climbingGotAssistance',
                title: 'Climbing Got Assistance'
            },
            {
                data: 'speed',
                title: 'Speed'
            },
            {
                data: 'stability',
                title: 'Stability'
            },
            {
                data: 'driverSkill',
                title: 'Driver Skill'
            },
            {
                data: 'defence',
                title: 'Defence'
            },
            {
                data: 'anythingBreak',
                title: 'Anything Break'
            },
            {
                data: 'dead',
                title: 'Dead'
            }
        ]
    })
}