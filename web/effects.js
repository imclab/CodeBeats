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

/**
@class Overdrive distortion effect
@extends SynthNode
*/
function Overdrive(numOscs)
{
    this.name = 'overdrive';

    /**
    Input gain
    */
    this.gain = 1;

    /**
    Clipping threshold
    */
    this.threshold = 0.7;

    /**
    Clipping factor (ratio is 1 / factor)
    */
    this.factor = 1;

    // Sound Input
    new SynthInput(this, 'input');

    // Sound output
    new SynthOutput(this, 'output');
}
Overdrive.prototype = new SynthNode();

/**
Update the outputs based on the inputs
*/
Overdrive.prototype.update = function (time, sampleRate)
{
    // If this input has no available data, do nothing
    if (this.input.hasData() === false)
        return;

    // Get the input buffer
    var inBuf = this.input.getBuffer();

    // Get the output buffer
    var outBuf = this.output.getBuffer();

    var f = 1 / this.factor;

    // For each sample
    for (var i = 0; i < inBuf.length; ++i)
    {
        var s = inBuf[i] * this.gain;

        var absS = Math.abs(s);

        var d = absS - this.threshold;

        if (d > 0)
        {
            absS = (absS - d) + (f * d);

            s = (s > 0)? absS:-absS;                
        }

        outBuf[i] = s;
    }
}

