

$(function() {
    $('.brush ul li').click(function() {
        var oUrl = $(this).find('img').attr('src');
        $('.detail_big')[0].style.background = 'url('+oUrl+')no-repeat 0px 0px/100% 100%';
    })

//        字体颜色的改变
    $('.fontColor input').change(function() {
        $('#detail_content').css("color",$('.fontColor input').val());
    })

})





