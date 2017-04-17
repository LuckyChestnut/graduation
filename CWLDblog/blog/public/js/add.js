
$(function() {
//        获取标签的按钮
    var oBtnBq = document.querySelector('.btn_biaoqian');
    var oDivBq = document.querySelector('.biaoqian');
    var oSpanBq = document.querySelectorAll('.biaoqian>span');
    var oPbq = document.querySelector('.p_biaoqian');
    var oBbq = document.querySelector('.b_biaoqian');
    console.log(oBbq);
    oBtnBq.onclick = function () {
        $(oDivBq).fadeToggle(function () {

        });
        for(var i=0;i<oSpanBq.length;i++) {
            oSpanBq[i].onclick = function () {
                var str = '';
                $(this).toggleClass('xuan');
                var _this = this;
                console.log(_this);
                var oXuan = document.querySelectorAll('.xuan');
                if(oXuan.length>3) {
                    oPbq.innerHTML = '最多选 3 个标签！';
                    $(oPbq).hide(3000);
                    _this.removeAttribute('class','xuan');
                } ;
                var oXu = document.querySelectorAll('.xuan');
                for(var i=0;i<oXu.length;i++){
                    str += '    ' + oXu[i].innerHTML;
                }
                oBbq.value =  str;
            }
        }

    }


})




