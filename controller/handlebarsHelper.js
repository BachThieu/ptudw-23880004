'use strict'

const helper = {};

helper.createStarList = (stars) => {
    let star = Math.floor(stars);
    let haft = stars - star;
    let str =  '<div class="ratting">';
    let i;
    for(i = 0; i < star; i++){
        str += '<i class="fa fa-star"></i>';
    }
    if(haft > 0){
        str += '<i class="fa fa-star-half"></i>';
        i++;
    }
    for(; i < 5; i++){
        str += '<i class="fa fa-star-o"></i>';
    }
    str += '</div>';
    return str;
}

module.exports = helper;