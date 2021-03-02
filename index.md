## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/cyc001/x/edit/gh-pages/index.md) to maintain and preview the content for your website in Markdown files.

<!DOCTYPE html>
<!--
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
-->
<html>
<head>

    <meta charset="utf-8">
    <meta name="description" content="WebRTC code samples">
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
    <meta itemprop="description" content="Client-side WebRTC code samples">

    <meta itemprop="name" content="WebRTC code samples">
    <meta name="mobile-web-app-capable" content="yes">
    <meta id="theme-color" name="theme-color" content="#ffffff">

    <base target="_blank">

    <title>MediaStream Recording</title>


    <link rel="stylesheet" href="css/main.css">

</head>

<body>

<div id="container">
<input type='file' id='file'/>
    <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a>
        <span>MediaRecorder</span></h1>

    <p>For more information see the MediaStream Recording API <a
            href="http://w3c.github.io/mediacapture-record/MediaRecorder.html"
            title="W3C MediaStream Recording API Editor's Draft">Editor's&nbsp;Draft</a>.</p>

    <video id="gum" playsinline autoplay muted></video>
    <video id="recorded" playsinline loop></video>

    <div>
        <button id="start">Start camera</button>
        <button id="record" disabled>Start Recording</button>
        <button id="play" disabled>Play</button>
        <button id="download" disabled>Download</button>
		
		  <button id="play_blob" >play_blob</button>
    </div>

    <div>
        <h4>Media Stream Constraints options</h4>
        <p>Echo cancellation: <input type="checkbox" id="echoCancellation"></p>
    </div>

    <div>
        <span id="errorMsg"></span>
    </div>



</div>

<!-- include adapter for srcObject shim -->
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
<script src="js/main.js" async></script>
<script src="js/file.js" async></script>
<script src="js/rec.js" async></script>
</body>
</html>
