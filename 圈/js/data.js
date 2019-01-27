var data = []


function add(num,length) {
    for(let i = 0; i<length; i++){
        let number = i+num;
        data.push({
            img:number+'.jpg',
            caption:number,
            desc:'The biggest mistake people make in life is not trying to make a living at doing what they most enjoy.'
        })
    }
}

add(8143,6);
add(2202,5);
add(12014,6)
