import $ from 'https://cdn.skypack.dev/jquery@3.6.0';

$(function ()
{
    $('body').show();

    $('#header__btn-menu').on('click', () =>
    {
        $('.header-menu').addClass('header-menu--open')
        $('body').addClass("fixed-position");
    });

    $('#header-menu__btn-close').on('click', () =>
    {
        $('.header-menu').removeClass('header-menu--open')
        $('body').removeClass("fixed-position");
    });
});