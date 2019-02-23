window.onload = function () {
    var $matches = $('#matches');
    var matches = JSON.parse($matches.text());
    var $pit = $('#pit');
    var pit = JSON.parse($pit.text());
    var $team = $('#team');
    var team = JSON.parse($team.text());
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
    $('#match-table').on( 'column-visibility.dt', function ( e, settings, column, state ) {
        for (var i = 0; i < matches.length; i++) {
            $('#match-table').DataTable().draw()
            $( `td.sorting_1:contains(${matches[i]._id})` ).eq(1).parent().css( "height", $( `td.sorting_1:contains(${matches[i]._id})` ).eq(0).height() + 16);
        }
    } );
}