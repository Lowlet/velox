import * as $ from 'jquery'
import tweenCamera from './webgl.js';
import '../scss/main.scss'

const positions = [
    [3.2, 11.5, 10.6],
    [-29, 10.2, 9.3],
    [-10.9, 5.6, -10.4]
];
const rotations = [
    [-1.5, 0, 1],
    [-1, -0.7, -0.8],
    [-2.6, -0.4, -2.9]
];
let currentPosition = 0;
let benefitsShown;
let infoShown;

$(function ()
{
    $('body').show();

    $(window).on('scroll', function ()
    {
        if (!benefitsShown)
        {
            if ($('.benefits').offset().top - $(window).scrollTop() < window.innerHeight / 3)
            {
                benefitsShown = true;
                currentPosition = currentPosition + 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
        else
        {
            if ($('.benefits').offset().top - $(window).scrollTop() > window.innerHeight / 3)
            {
                benefitsShown = false;
                currentPosition = currentPosition - 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
        if (!infoShown)
        {
            if ($('.info').offset().top - $(window).scrollTop() < window.innerHeight / 2)
            {
                infoShown = true;
                currentPosition = currentPosition + 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
        else
        {
            if ($('.info').offset().top - $(window).scrollTop() > window.innerHeight / 2)
            {
                infoShown = false;
                currentPosition = currentPosition - 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
    });
});

