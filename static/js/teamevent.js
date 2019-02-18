window.onload = function() {
    var $matches = $('#matches');
    var matches = JSON.parse($matches.text());
    var $pit = $('#pit');
    var pit = JSON.parse($pit.text());
    var $team = $('#team');
    var team = JSON.parse($team.text());
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
    document.getElementById("photo1").src = URL.createObjectURL(b64toBlob(pit[0]._attachments['photo1.jpg'].data, 'image/jpeg'));
    document.getElementById("photo2").src = URL.createObjectURL(b64toBlob(pit[0]._attachments['photo2.jpg'].data, 'image/jpeg'));
}