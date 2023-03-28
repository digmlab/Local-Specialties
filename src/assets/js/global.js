// 网页加载完成后，再显示网页
document.onreadystatechange = function () {
    if(document.readyState == 'complete') {
        document.body.style.display = 'block'
    } else {
        document.body.style.display = 'none'
    }
}