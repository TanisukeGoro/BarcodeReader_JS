let takePicture = document.querySelector("#Take-Picture"),
    showPicture = document.createElement("img");
Result = document.querySelector("#textbit");
let canvas = document.getElementById("picture");
let ctx = canvas.getContext("2d");

/**
 * JOBの読み込みと、初期化
 */
// JOB = new Worker("./JOB.js");
JOB.Init();

/**
 * 認識の結果が返ってくる
 * 認識されたバーコードの数だけ配列で返ってくるので注意
 * これを書き換えてPHP側に投げるか、form の input に投げるといい。
 */
JOB.SetImageCallback(function(result) {
    if (result.length > 0) {
        let tempArray = [];
        for (let i = 0; i < result.length; i++) {
            tempArray.push(result[i].Format + " : " + result[i].Value);
        }
        Result.innerHTML = tempArray.join("<br />");
    } else {
        if (result.length === 0) {
            Result.innerHTML = "Decoding failed.";
        }
    }
});

/**
 * 以下はそんなに大事でないので、消してしまっても良い.
 * 内容としては受けっとった画像をDOM上に描画するのと
 * 検出されたバーコードを赤枠で囲む処理
 * 2つ以上検出されれば個別に囲ってくれるはず
 */
JOB.PostOrientation = true;
JOB.OrientationCallback = function(result) {
    canvas.width = result.width;
    canvas.height = result.height;
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < data.data.length; i++) {
        data.data[i] = result.data[i];
    }
    ctx.putImageData(data, 0, 0);
};
JOB.SwitchLocalizationFeedback(true);
JOB.SetLocalizationCallback(function(result) {
    ctx.beginPath();
    ctx.lineWIdth = "2";
    ctx.strokeStyle = "red";
    for (let i = 0; i < result.length; i++) {
        ctx.rect(result[i].x, result[i].y, result[i].width, result[i].height);
    }
    ctx.stroke();
});
if (takePicture && showPicture) {
    takePicture.onchange = function(event) {
        let files = event.target.files;
        if (files && files.length > 0) {
            file = files[0];
            try {
                let URL = window.URL || window.webkitURL;
                showPicture.onload = function(event) {
                    Result.innerHTML = "";
                    JOB.DecodeImage(showPicture);
                    URL.revokeObjectURL(showPicture.src);
                };
                showPicture.src = URL.createObjectURL(file);
            } catch (e) {
                try {
                    let fileReader = new FileReader();
                    fileReader.onload = function(event) {
                        showPicture.onload = function(event) {
                            Result.innerHTML = "";
                            JOB.DecodeImage(showPicture);
                        };
                        showPicture.src = event.target.result;
                    };
                    fileReader.readAsDataURL(file);
                } catch (e) {
                    Result.innerHTML = "Neither createObjectURL or FileReader are supported";
                }
            }
        }
    };
}