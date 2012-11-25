/*****************************************************************************
*
*                  CodeBeats : Online Music Coding Platform
*
*  This file is part of the CodeBeats project. The project is distributed at:
*  https://github.com/maximecb/CodeBeats
*
*  Copyright (c) 2012, Maxime Chevalier-Boisvert
*  All rights reserved.
*
*  This software is licensed under the following license (Modified BSD
*  License):
*
*  Redistribution and use in source and binary forms, with or without
*  modification, are permitted provided that the following conditions are
*  met:
*    * Redistributions of source code must retain the above copyright
*      notice, this list of conditions and the following disclaimer.
*    * Redistributions in binary form must reproduce the above copyright
*      notice, this list of conditions and the following disclaimer in the
*      documentation and/or other materials provided with the distribution.
*    * Neither the name of the Universite de Montreal nor the names of its
*      contributors may be used to endorse or promote products derived
*      from this software without specific prior written permission.
*
*  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
*  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
*  TO, THE IMPLIED WARRANTIES OF MERCHApNTABILITY AND FITNESS FOR A
*  PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL UNIVERSITE DE
*  MONTREAL BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
*  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
*  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
*  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
*  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
*  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
*  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*****************************************************************************/

//============================================================================
// Page interface code
//============================================================================

/**
Called after page load to initialize needed resources
*/
function init()
{
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");

    // Get a 2D context for the drawing canvas
    canvasCtx = canvas.getContext("2d");

    // Create an audio context
    if (this.hasOwnProperty('AudioContext') === true)
    {
        //console.log('Audio context found');
        audioCtx = new AudioContext();
    }
    else if (this.hasOwnProperty('webkitAudioContext') === true)
    {
        //console.log('WebKit audio context found');
        audioCtx = new webkitAudioContext();
    }
    else
    {
        audioCtx = undefined;
    }

    // If an audio context was created
    if (audioCtx !== undefined)
    {
        // Get the sample rate for the audio context
        var sampleRate = audioCtx.sampleRate;

        console.log('Sample rate: ' + audioCtx.sampleRate);

        // Size of the audio generation buffer
        var bufferSize = 2048;
    }
    else
    {
        alert(
            'No Web Audio API support. Sound will be disabled. ' +
            'Try this page in the latest version of Chrome'
        );

        var sampleRate = 44100;
    }

    // Create a synthesis network
    var synthNet = new SynthNet(sampleRate);

    // Create a piece
    var piece = new Piece(synthNet);

    // Initialize the synth network
    initSynth(synthNet, piece);

    // Create an audio generation event handler
    var genAudio = piece.makeHandler();

    // JS audio node to produce audio output
    var jsAudioNode = undefined;

    playAudio = function ()
    {
        // If audio is disabled, stop
        if (audioCtx === undefined)
            return;

        // If the audio isn't stopped, stop it
        if (jsAudioNode !== undefined)
            stopAudio()

        // Set the playback time on the piece to 0 (start)
        piece.setTime(0);

        // Create a JS audio node and connect it to the destination
        jsAudioNode = audioCtx.createJavaScriptNode(bufferSize, 2, 2);
        jsAudioNode.onaudioprocess = genAudio;
	    jsAudioNode.connect(audioCtx.destination);

        //drawInterv = setInterval(drawTrack, 100);
    }

    stopAudio = function ()
    {
        // If audio is disabled, stop
        if (audioCtx === undefined)
            return;

        if (jsAudioNode === undefined)
            return;

        // Notify the piece that we are stopping playback
        piece.stop();

        // Disconnect the audio node
        jsAudioNode.disconnect();
        jsAudioNode = undefined;

        // Clear the drawing interval
        //clearInterval(drawInterv);
    }
}

// Attach the init function to the load event
if (window.addEventListener)
    window.addEventListener('load', init, false); 
else if (document.addEventListener)
    document.addEventListener('load', init, false); 
else if (window.attachEvent)
    window.attachEvent('onload', init); 

