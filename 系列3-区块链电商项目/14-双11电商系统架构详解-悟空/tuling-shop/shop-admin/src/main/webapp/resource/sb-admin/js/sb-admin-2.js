/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    //var url = window.location;
    //var element = $('ul.nav a').filter(function() {
    //    return this.href == url || url.href.indexOf(this.href) == 0;
    //}).addClass('active').parent().parent().addClass('in').parent();
    //if (element.is('li')) {
    //    element.addClass('active');
    //}


    $.fn._dataTable= $.fn.dataTable;
    $.fn.dataTable = function(options){
        options = $.extend({
            responsive: true,
                scrollY: 300,
            searching: false,
            "serverSide": true,
            "processing": true,
            "ordering":false,
            pagingType:"full_numbers",//simple,simple_numbers,full,full_numbers
            lengthMenu:[1,10,20,50,100],
            pageLength:10,
            "language": {
                "lengthMenu": "?????? _MENU_ ?????????",
                "zeroRecords": "??????????????????",
                //"info": "??? _PAGE_ / _PAGES_ ?????? ??? _TOTAL_ ??????????????????_START_ - _END_",
                "info": "??? _PAGE_ / _PAGES_ ?????? ??? _TOTAL_ ???",
                "infoEmpty": "?????????",
                "emptyTable": "?????????",
                "infoFiltered": "(??? _MAX_ ???????????????)",
                "infoPostFix": "",
                "thousands": ",",
                "loadingRecords": "?????????...",
                "processing": "?????????...",
                "search": "??????:",
                "paginate": {
                    "first": "|<",
                    "last": ">|",
                    "next": ">>",
                    "previous": "<<"
                },
                "aria": {
                    "sortAscending": ": ????????????",
                    "sortDescending": ": ????????????"
                },
//                "emptyTable":     "No data available in table",
//                "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
//                "infoEmpty":      "Showing 0 to 0 of 0 entries",
//                "infoFiltered":   "(filtered from _MAX_ total entries)",
//                "infoPostFix":    "",
//                "thousands":      ",",
//                "lengthMenu":     "Show _MENU_ entries",
//                "loadingRecords": "Loading...",
//                "processing":     "Processing...",
//                "search":         "Search:",
//                "zeroRecords":    "No matching records found",
//                "paginate": {
//                    "first":      "First",
//                    "last":       "Last",
//                    "next":       "Next",
//                    "previous":   "Previous"
//                },
//                "aria": {
//                    "sortAscending":  ": activate to sort column ascending",
//                    "sortDescending": ": activate to sort column descending"
//                }

            }
        }, options || {});
        return $(this)._dataTable(options);
    }

    //??????????????????????????????bootstrap3???????????????
    $("form :text,:password,select").not(".form-control").each(function(){
        var display = $(this).css("display");
        $(this).addClass("form-control").css("width","auto").css("display",display||"inline-block");
    });
});
