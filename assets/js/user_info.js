$(function () {
    var form = layui.form
    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个之间！'
            }

        }
    })

    initUserinfo()
    //初始化用户基本信息
    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);
                form.val('formUserInfo', res.data)

            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置
        e.preventDefault();
        initUserinfo()


    })


    // 监听表单的提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                //  调用父页面
                window.parent.getUserInfo()
            }



        })

        $('.layui-form-item  [name=nickname]').val("请输入用户昵称")
        $('.layui-form-item [name=email]').val("请输入用户邮箱")
    })
})
