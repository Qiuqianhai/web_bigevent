$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {

                    return layer.msg('获取分类列表失败')
                }
                layer.msg('获取分类列表成功')
                console.log(res);


                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)

            }
        })
    }


    // 初始化文章分类

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()


            }

        })

    }


    // 为筛选表单绑定submit事件
    $('#form-serach').on('submit', function (e) {
        e.preventDeFault()

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()


        q.cate_id = cate_id
        q.state = state

        initTable()
    })


    function renderPage(total) {
        console.log(total);
        laypage.render({
            elem: 'pageBox',//分页容器ID

            count: total,//总数据条数
            limit: q.pagesize,//每页个数
            curr: q.pagenum,//默认被选择的分页
            layout: ['count', 'limit', 'page', 'next', 'prev', 'skip'],
            limits: [2, 3, 5, 10],

            jump: function (obj, first) {
                console.log(first);
                console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q
                // initTable()
                if (!first) {
                    initTable()
                }
            }

        })

    }



    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    if (len === 1) {
                        q.pagenum >= 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

})