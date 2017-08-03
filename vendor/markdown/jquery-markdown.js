$(function () {
    $("[markdown-view]").html(markdown.toHTML($("[markdown-data]").html()));
    $("[markdown-data]").on("input",function () {
        $("[markdown-view]").html(markdown.toHTML($(this).html()));
    });

})