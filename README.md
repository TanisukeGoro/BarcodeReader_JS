# Barcode Reader for JS
[BarcodeReader | Github](https://github.com/EddieLa/JOB)を少し改変して少し使いやすくしました。

## Getting Started

ターミナルを起動して適当なディレクトリに移動、以下のコマンド打ってローカルサーバー上でデバッグする。  
PHPで開発するならローカルサーバーが起動しているので特に気にすることはないです。

```bash
 $ git clone https://github.com/TanisukeGoro/BarcodeReader_JS.git
 $ cd BarcodeReader_JS
 $ python -m http.server 8000
 # if your python version is 2.x ... 
 $ python -m SimpleHTTPServer 8000 
```


## 注意点
`webworker`を使用しているのでlocalhostを起動しないとうまく動作しません。

また、ディレクトリ構成を変更する際には`JOB.js`を変更する必要があります。
`JOB.js`の`45行目`の`DecodeWorker.js`と`54行目`の`exif.js`を適当なものに変更します。

```javascript

// 適当なディレクトリを指定
DecoderWorker: new Worker("./barcode-reader/DecoderWorker.js"),

    OrientationCallback: null,
    // Always call the Init().
    Init: function() {
        JOB.ScanCanvas = JOB.FixCanvas(document.createElement("canvas"));
        JOB.ScanCanvas.width = 640;
        JOB.ScanCanvas.height = 480;
        JOB.ScanContext = JOB.ScanCanvas.getContext("2d");
        var script = document.createElement('script');

        // 適当なディレクトリを指定
        script.src = "./barcode-reader/exif.js";
        script.type = 'text/javascript';
        document.getElementsByTagName('head').item(0).appendChild(script);
    },

```