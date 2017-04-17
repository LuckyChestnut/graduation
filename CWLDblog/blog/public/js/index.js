
$(function() {

    $(".yilong>ul>li").hover(function() {
        $(this).stop(true).animate({"width":"347px"},500,function() {
            $(this).find('.up').show(500).css({backgroundColor:'rgba(225,225,225,.7)'});
        }).siblings('li').stop(true).animate({"width":184},500);
    },function() {
        $(".yilong>ul>li").stop(true).animate({"width": 215}, 500);
        $(this).find('.up').fadeOut(500);
    })

//        列表部分
    var _this = '';
    $('.every').hover(function() {
        _this = $(this);
        $(this).find('.index_logo').addClass('img');
    },function() {
        setTimeout(function () {
            _this.find('.index_logo').removeClass('img');
        },500);
    });


})







