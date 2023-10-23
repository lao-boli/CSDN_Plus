// ==UserScript==
// @name         CSDN_Plus
// @namespace    https://github.com/lao-boli
// @version      1.1.5
// @description  CSDN去广告、免登陆阅读全文、自由复制、不显示需要下载的资源、纯净阅读模式
// @author       hqully
// @match        *://*.blog.csdn.net/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-2.0 License
// ==/UserScript==
(function () {
    ("use strict");

    let pureModeOn = false;

    // 主要功能函数聚合
    function functionAggregation() {
        init();
        removeAds();
        fullTextRead();
        freeCopy();
        hideColumnInfo();
        hideDownload();
        hideSide();
        extendCode();
        handlePureMode();
    }

    // 自动展开长代码块
    function extendCode() {
        $(".hide-preCode-box").css("display", "none");
        $(".set-code-hide.prettyprint").attr('class',"set-code-show");
        $(".set-code-hide").attr('class',"set-code-show");
    }

    function removeAds() {
        // 去广告
        $(".adsbygoogle").css("display", "none");
    }

    // 隐藏下载的资源,即在推荐列表中只会显示文章,不会显示需要下载的资源
    function hideDownload() {
        $(".recommend-item-box.type_download").css("display", "none");
    }

    // 代码区自由复制
    function freeCopy() {
        $("#content_views pre code").css("user-select", "text");

        // 解绑csdn绑定的复制前需登录的事件
        $("#content_views").unbind("keydown")
        $("#content_views").unbind("copy")

      // 隐藏未登录复制时弹出的登录框
        hideLogin();
        // 修改按钮名称
        $(".hljs-button").attr("data-title", "复制");
        // 点击按钮复制整个代码块内容
        $(".hljs-button").click(function () {
            GM_setClipboard(this.parentNode.innerText);
            this.setAttribute("data-title", "复制成功");
            setTimeout(() => {
                this.setAttribute("data-title", "复制");
            }, 500);
        });

        // 恢复默认全局复制事件，去除复制时的小尾巴
        document.oncopy = (e) => {
            e.clipboardData.setData("text/plain", window.getSelection());
        };
    }

    // 隐藏登录框
    function hideLogin() {
        GM_addStyle(".passport-login-container{display:none!important;}");
        GM_addStyle(".passport-auto-tip-login-container{display:none!important;}");
    }

    // 隐藏作者系列文章列表fix在顶部的专栏信息
    function hideColumnInfo() {
        $(".column_info_box").css("display", "none");
    }

    function hideSide() {
        GM_addStyle(".csdn-side-toolbar{display:none!important;}");
    }

    // 全文阅读
    function fullTextRead() {
        // 不隐藏文章内容
        $("#article_content").css("height", "auto");
        //隐藏“关注展开”box
        $(".hide-article-box").css("display", "none");
        // 移除侧边栏目录点击事件，否则在未登录情况下点击后半部分目录会跳转到登录界面
        $("#asidedirectory a").unbind("click");
    }

    // 纯净模式
    function pureMode(on) {
        if (on) {
            // 隐藏四周的栏位
            GM_addStyle("#csdn-toolbar{display:none}");
            GM_addStyle(".blog_container_aside{display:none}");
            $("#rightAside").css("display", "none");
            $("#toolBarBox").css("display", "none");
            $(".csdn-side-toolbar ").css("display", "none");

            // 主体内容撑满屏幕
            $(".nodata .container").css("display", "flex");
            $(".nodata .container").css("flex", "auto");
            $(".nodata .container main").css("flex", "auto");
            $(".nodata .container").css("margin-right", "0");
        } else {
            // 恢复四周的栏位
            GM_addStyle("#csdn-toolbar{display:inherit}");
            GM_addStyle(".blog_container_aside{display:inherit}");
            $("#rightAside").css("display", "");
            $("#toolBarBox").css("display", "");
            $(".csdn-side-toolbar ").css("display", "");

            // 恢复主体内容宽度
            $(".nodata .container").css("display", "");
            $(".nodata .container").css("flex", "");
            $(".nodata .container main").css("flex", "");
        }
    }

    // 纯净模式切换控制函数
    function handlePureMode() {
        pureModeOn = !pureModeOn;
        pureMode(pureModeOn);
    }

    function init() {
        // 快捷键控制纯净模式切换,快捷键默认为alt+z,如有需要可自行更改
        document.onkeydown = (e) => {
            if (e.altKey && e.key === "z") {
                handlePureMode();
            }
        };

        // 使用谷歌浏览器时,如果只是按下alt键会让焦点移动到'设置'上,按键事件失效,故在此阻止默认事件
        document.onkeyup = (e) => {
            if (e.key === "Alt") {
                e.preventDefault();
            }
        };

        // 菜单控制纯净模式切换
        GM_registerMenuCommand("纯净模式", handlePureMode, "p");
    }

    if (document.readyState !== "loading") {
        // 所有dom节点加载完毕，调用函数
        functionAggregation();
    } else {
        // dom节点未加载完毕，添加监听器，等待加载完成后调用函数
        document.addEventListener(
            "DOMContentLoaded",
            functionAggregation,
            false
        );
    }

})();
