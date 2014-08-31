// ==UserScript==
// @name        netwx-fixes
// @namespace   lol-blr
// @description Fixes some annoyingly excessive UI naviagtion on the model viewer pages
// @include     http://www.netweather.tv/*
// @version     1
// @grant       none
// ==/UserScript==

window.onload = apply_fixes;

function apply_fixes() {
    gfs_ecm_fix();
    ens_fix();
}

function ens_fix() {
    var location = document.getElementById('s2');
    location.value = 'London';
    
    var graph = document.getElementById('s1');
    graph.value = 't850';
    
    javascript:changegraph('1');
}

function gfs_ecm_fix() {
    var graph = document.getElementById('c1');
    graph.selectedIndex=2
    
    javascript:changeimage('1');
}

