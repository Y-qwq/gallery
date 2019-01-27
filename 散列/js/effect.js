let IMG_PATH = '../assets/photo/';

// 获取节点
function g(selector) {
    let method =
        selector.substr(0, 1) == "." ?
        "getElementsByClassName" :
        "getElementById";
    return document[method](selector.substr(1));
}

// 添加data里存储的照片到html中
function addphotos() {
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
// 获取位置随机范围
function range() {
    // 左右照片的随机位置范围
    let range = {
        left: { x: [], y: [] },
        right: { x: [], y: [] }
    };
    // 当前的wrap的宽高
    let wrap = {
        w: g("#wrap").clientWidth,
        h: g("#wrap").clientHeight
    };
    // 获取一个photo的宽高
    let photo = {
        w: g(".photo")[0].clientWidth,
        h: g(".photo")[0].clientHeight
    };
    range.wrap = wrap;
    range.photo = photo;
    // 左右两侧的范围，再减去因css样式，margin: -160px 0 0 -130px;损失的值
    range.left.x = [0 - photo.w / 2, wrap.w / 2 ];
    range.left.y = [0 - photo.h / 2, wrap.h + photo.h / 2 ];

    range.right.x = [wrap.w / 2 + photo.w , wrap.w + photo.w * 1.5];
    range.right.y = range.left.y;
    return range;
}
// 重排序
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
        
        // 重置left top
        _photo[s].style.left = "";
        _photo[s].style.top = "";

        // 添加360旋转特效并且转正 放大1.3倍
        _photo[s].style["transform"] = _photo[s].style["-webkit-transform"] =
            "rotate(360deg) scale(1.3)";
        photos.push(_photo[s]);
    }
    // 获取中间照片节点，并添加className：photo_center
    let photo_center = g("#photo_" + n);
    photo_center.className += " photo_center ";

    // photos数组里减去要显示再中间的照片，因为splice是改变原数组的方法
    photo_center = photos.splice(n, 1)[0];

    let photo_left = photos.splice(0, Math.ceil(photos.length / 2));
    let photo_right = photos;
    let ranges = range();

    // 左侧相片
    for (const s in photo_left) {
        let photo = photo_left[s];
        photo.style.left = random(ranges.left.x) + "px";
        photo.style.top = random(ranges.left.y) + "px";
        photo.style["transform"] = photo.style["-webkit-transform"] =
            "rotate(" + random([-100, 100]) + "deg) scale(1)";
    }
    // 右侧相片
    for (const s in photo_right) {
        let photo = photo_right[s];
        photo.style.left = random(ranges.right.x) + "px";
        photo.style.top = random(ranges.right.y) + "px";
        photo.style["transform"] = photo.style["-webkit-transform"] =
            "rotate(" + random([-100, 100]) + "deg) scale(1)";
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
    let n = elem.id.split("_")[1];
    // 不是中间照片则重排序
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
addphotos();
rsort(random([0, data.length]));