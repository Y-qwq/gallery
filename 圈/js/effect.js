// 照片的基础路径
var IMG_PATH = '../assets/photo/';
// 距离中心的长度
var DISTANCE = 450;

 // 当前的wrap的宽高
var WRAP = {
    w: g("#wrap").clientWidth,
    h: g("#wrap").clientHeight
};
// 获取一个photo的宽高
var PHOTO = {
    w: g(".photo")[0].clientWidth,
    h: g(".photo")[0].clientHeight
};

// 获取节点
function g(selector) {
    let method =
        selector.substr(0, 1) == "." ?
        "getElementsByClassName" :
        "getElementById";
    return document[method](selector.substr(1));
}


// 添加data里存储的照片到html中
function addphotos(data) {
    let template = g("#wrap").innerHTML;
    let html = [];
    let nav = [];
    // 模板替换
    for (const s in data) {
        let _html = template
            .replace("{{ index }}", s)
            .replace("{{ img }}", IMG_PATH + data[s].img)
            .replace("{{ caption }}", data[s].caption)
            .replace("{{ desc }}", data[s].desc);

        html.push(_html);
        
        nav.push(
            '<span id="nav_' + s + "\" onclick=turn(g('#photo_" + s + '\')) class="i">&nbsp;</span>'
        );
    }
    html.push('<div class="nav">' + nav.join("") + "</div>");
    g("#wrap").innerHTML = html.join("");
}

// 随机函数 输入[min,max]
function random(range) {
    let max = Math.max(range[0], range[1]);
    let min = Math.min(range[0], range[1]);
    let diff = max - min;

    let number = Math.round(Math.random() * diff + min);
    return number;
}

// 照片重排序 n为中间photo的id
function rsort(n) {
    let _photo = g(".photo");
    let photos = [];
    for (let s = 0; s < _photo.length; s++) {
        _photo[s].className = _photo[s].className.replace(
            /\s*photo_center\s*/,
            " "
        );
        _photo[s].className = _photo[s].className.replace(
            /\s*photo_back\s*/,
            " "
        );

        photos.push(_photo[s]);
    }

    //给选中的照片添加：居中，放大1.3倍
    _photo[n].style["transform-origin"] = _photo[n].style["-webkit-transform-origin"] = "center center";
    _photo[n].style["transform"] = _photo[n].style["-webkit-transform"] = "translate(0," + 0 + "px) rotate(0deg) scale(1.3) ";
    
    // 获取中间照片节点，并添加className：photo_center
    let photo_center = g("#photo_" + n);
    photo_center.className += " photo_center ";

    // photos数组里减去要显示的中间的照片，splice是改变原数组的方法
    photo_center = photos.splice(n, 1)[0];


    for (const s in photos) {
        let deg = random([0,360]);
        let x = Math.cos(deg*Math.PI/180)*DISTANCE;
        let y = Math.sin(deg*Math.PI/180)*DISTANCE;

        let photo = photos[s];
        /**
         * photo.clientWidth起到强制同步样式的作用
         * 不可删除 否则会失去打开时的效果
         * 
         * 这是浏览器渲染机制导致的。
         * 页面等待js线程执行完毕，随后执行GUI线程渲染，而以下代码，对于GUI线程来说页面上没有任何改变，自然不会做任何动作。
         * 
         * 若要删去，则需要在最后的rsort(random([0, data.length]));这一行代码里包裹一层setTimeout
         */
        photo.clientWidth;
        photo.style["transform-origin"] = photo.style["-webkit-transform-origin"] = PHOTO.w/2 + "px " + (DISTANCE + PHOTO.h/2) + "px";
        photo.style["transform"] = photo.style["-webkit-transform"] = "translate(0px,-"+DISTANCE+"px) rotate("+deg+"deg) scale(1)";
    } 
    
   
    // 导航条
    let navs = g(".i");
    // 清空当前特效
    for (let s = 0; s < navs.length; s++) {
        navs[s].className = navs[s].className.replace(/\s*i_current\s*/, " ");
        navs[s].className = navs[s].className.replace(/\s*i_back\s*/, " ");
    }
    g("#nav_" + n).className += " i_current ";
}


// 翻转
function turn(elem) {
    let cls = elem.className;
    // 获取点击的照片的id
    let n = elem.id.split("_")[1];
    // 点击不是中间照片则重排序
    if (!/photo_center/.test(cls)) {
        return rsort(n);
    }
    // 防止转牌过程中切换图片造成的calssName：photo_front丢失
    if(!/photo_front/.test(cls) && !/photo_back/.test(cls)){
        cls += 'photo_front';
    }
    // 正常反转
    if (/photo_front/.test(cls)) {
        cls = cls.replace(/photo_front/, "photo_back");
        g("#nav_" + n).className += " i_back ";
    } else {
        cls = cls.replace(/photo_back/, "photo_front");
        g("#nav_" + n).className = g("#nav_" + n).className.replace(
            /\s*i_back\s*/,
            " "
        );
    }
    return (elem.className = cls);
}

// 这里的data是data.js的，在这仅作强调作用
var data = data;
addphotos(data);
rsort(random([0, data.length]));
