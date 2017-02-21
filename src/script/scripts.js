/**
 * Created by Michał_2 on 2016-12-19.
 */

var App = {
    //variables
    USER_ITEM: "user-item",
    USERS_LIST: "users-list",
    BUTTON: "button",
    CLICK_EVENT: "click",
    FOCUSOUT_EVENT: "focusout",
    FORM_ID: "user-form",
    MODAL_ID: "modal",
    SUBMIT_BUTTON: "submit",
    EDIT_BUTTON: "button-edit",
    DELETE_BUTTON: "delete",
    ID_LAST_USER: 0,
    MIN_INPUT: {
        pattern: /[a-zA-Z]{3,}/,
        errorMessage: "Please enter minimum 3 chars!"
    },
    ZIP_CODE_INPUT: {
        pattern: /([0-9]{2}[-/s][0-9]{3})/,
        errorMessage: "Please enter correctly Zip-Code"
    },
    PHONE_INPUT: {
        pattern: /([0-9])\w/,
        errorMessage: "Please enter correctly Phone"
    },
    EMAIL_INPUT: {
        pattern: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/,
        errorMessage: "Please enter correctly Email"
    },


    //init
    init: function () {
        App.getUsers();
        App.initAddNew();
        App.checkFocusOut();
        App.deleteAll();
        App.closeModal();
    },

    initAddNew: function () {
        $("#" + App.SUBMIT_BUTTON).on(App.CLICK_EVENT, function (event) {
            event.preventDefault();
            App.formValid();
            //App.showModal();
            console.log("correct");
        });
    },

    checkFocusOut: function () {
        console.log("validate inputs");
        App.focusValidName("#name", App.MIN_INPUT);
        App.focusValidStreet("#street", App.MIN_INPUT);
        App.focusValidCity("#city", App.MIN_INPUT);
        App.focusValidSuite("#suite", App.MIN_INPUT);
        App.focusValidZipcode("#zip-code", App.ZIP_CODE_INPUT);
        App.focusValidPhone("#phone", App.PHONE_INPUT);
        App.focusValidEmail("#email", App.EMAIL_INPUT);
    },
    //function
    getUsers: function () {
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com' + '/users',
            method: 'GET',
            success: function (data) {
                App.drawUsers(data);
            },
            error: function () {
                console.log("getting data error");
            }
        });
    },
    resetForm: function () {
        var resetIt = function () {
            $("#" + App.FORM_ID)[0].reset();
        };
        setTimeout(resetIt, 3000);
    },
    drawUsers: function (data) {
        var template = "";
        $.each(data, function (index, item) {
            template += App.getUserBlock(item);
            App.ID_LAST_USER++;
        });
        $("." + App.USERS_LIST).prepend(template);
        App.editUser();
    },

    getUserBlock: function (data) {
        var block = "";
        block += "<div class='new-user'>";
        block += "<div class='user-details'>";
        block += "<div class='input-box'><input type='text' name='name' disabled value='" + data.name + "'/></div>";
        block += "<div class='input-box'><input type='text' name='street' disabled value='" + data.address.street + "'/></div>";
        block += "<div class='input-box'><input type='text' name='city' disabled value='" + data.address.city + "'/></div>";
        block += "<div class='input-box'><input type='text' name='phone' disabled value='" + data.phone + "'/></div>";
        block += "</div>";
        block += '<button class="button" onclick="App.removeUser(' + data.id + ', event.target)">Remove</button>';
        block += '<button class="button-edit" onclick="App.editUser(event.target)">Edit</button>';
        block += '<button class="button-save" onclick="App.sendChange(' + data.id + ', event.target)">Save</button>';
        block += '</div>';
        return block;
    },

    removeUser: function (itemId, e) {
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/users/' + itemId,
            dataType: 'json',
            contentType: 'application/json',
            data: {'action': 'delete'},
            success: function () {
                $(e).parent().remove();
                alert("User was removed !");
            }
        });
    },

    editUser: function (e) {
        var element = $(e).closest(".new-user");
        element.addClass("edit show");
        element.find(".input-box > input").prop("disabled", false)
    },

    sendChange: function (buttonId, e) {
        console.log("aaaaa");
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com' + '/users/' + buttonId,
            method: 'PUT',
            data: {
                name: $(e).closest(".new-user").find(".input-box > input[name=name]").val(),
                street: $(e).closest(".new-user").find(".input-box > input[name=street]").val(),
                city: $(e).closest(".new-user").find(".input-box > input[name=city]").val(),
                phone: $(e).closest(".new-user").find(".input-box > input[name=phone]").val()
            },
            success: function (data) {
                console.log(data);
                console.log(e);
                var element = $(e).closest(".new-user");
                element.find(".input-box > input").prop("disabled", true);
                element.removeClass("edit show");
            },
            error: function () {
                console.log("%c Sending data error", "background-color: red; color: #fff");
            }
        });
    },

    deleteAll: function () {
        $("#" + App.DELETE_BUTTON).on(App.CLICK_EVENT, function () {
            var confirmation = confirm("Are you sure to delete?");
            if (confirmation) {
                $(".new-user").remove();
            }
            else {
                return false;
            }
        });
    },

    throwMessage: function (element, errorMessage) {
        console.log(element);
        $('<div class="message">' + errorMessage.errorMessage + '</div>').insertAfter(element);
        console.log(errorMessage);
    },

    destroyMessage: function (element) {
        console.log(element);
        $(element).siblings(".message").remove();
    },

    // input = "#name";
    // alert = /[a-zA-Z]{3,}/  &  "please enter 3 chars"
    focusValidName: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            console.log(input);
            console.log(alert);
            var name = $(input).val();
            console.log(name);
            if (!name.match(alert.pattern) || name.length == 0) {
                console.log(alert.pattern);
                App.throwMessage(e.target, alert);
                console.log(e.target);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },

    focusValidStreet: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            //var street = $('input[name=street]').val();
            //var min_input = /[a-zA-Z]{3,}/;
            var name = $(input).val();
            if (!name.match(alert.pattern) || name.length == 0) {
                //$('p.street').html('please complete correctly <span>Street</span>');
                App.throwMessage(e.target, alert);
                console.log(e.target);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },

    focusValidCity: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            //var city = $('input[name=city]').val();
            //var min_input = /[a-zA-Z]{3,}/;
            var name = $(input).val();
            if (!name.match(alert.pattern) || name.length == 0) {
                App.throwMessage(e.target, alert);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },

    focusValidSuite: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            //var suite = $('input[name=suite]').val();
            //var min_input = /[a-zA-Z]{3,}/;
            var name = $(input).val();
            if (!name.match(alert.pattern) || name.length == 0) {
                //$('p.suite').html('please complete correctly <span>Suite</span>');
                App.throwMessage(e.target, alert);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },

    focusValidZipcode: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            //var zipcode = $('input[name=zip-code]').val();
            //var zipcode_regex = /([0-9]{2}[-/s][0-9]{3})/;
            var name = $(input).val();
            if (!name.match(alert.pattern) || name.length == 0) {
                App.throwMessage(e.target, alert);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },

    focusValidPhone: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            //var phone = $('input[name=phone]').val();
            //var phone_regex = /([0-9])\w/;
            var name = $(input).val();
            if (!name.match(alert.pattern) || name.length != 9) {
                App.throwMessage(e.target, alert);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },
    focusValidEmail: function (input, alert) {
        $('#' + App.FORM_ID + " " + input).on(App.FOCUSOUT_EVENT, function (e) {
            //var email = $('input[name=email]').val();
            //var email_regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
            var name = $(input).val();
            if (!name.match(alert.pattern) || name.length == 0) {
                App.throwMessage(e.target, alert);
                return false;
            } else {
                App.destroyMessage(e.target);
            }
        });
    },

    formValid: function () {
        //get input
        var $name = $('#user-form input[name=name]');
        var $street = $('#user-form input[name=street]');
        var $email = $('#user-form input[name=email]');
        var $city = $('#user-form input[name=city]');
        var $suite = $('#user-form input[name=suite]');
        var $zipcode = $('#user-form input[name=zip-code]');
        var $phone = $('#user-form input[name=phone]');

        //regex input
        //var email_regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        //var phone_regex = /([0-9])\w/;
        //var zipcode_regex = /([0-9]{2}[-/s][0-9]{3})/;
        //var min_input = /[a-zA-Z]{3,}/;

        if (!$name.val().match(App.MIN_INPUT.pattern) || $name.val().length == 0) {
            $name.siblings(".error-chars").addClass("active");
            console.log($name.length);
            $name.focus();
            return false;
        }
        else if (!$street.val().match(App.MIN_INPUT.pattern) || $street.val().length == 0) {
            $street.siblings(".error-chars").addClass("active");
            console.log("error street");
            $street.focus();
            return false;
        }
        else if (!$city.val().match(App.MIN_INPUT.pattern) || $city.val().length == 0) {
            $city.siblings(".error-chars").addClass("active");
            $city.focus();
            return false;
        }
        else if (!$suite.val().match(App.MIN_INPUT.pattern) || $suite.val().length == 0) {
            $suite.siblings(".error-chars").addClass("active");
            $suite.focus();
            return false;
        }
        else if (!$zipcode.val().match(App.ZIP_CODE_INPUT.pattern) || $zipcode.val().length == 0) {
            $zipcode.siblings(".error-zipcode").addClass("active");
            $zipcode.focus();
            return false;
        }
        else if (!$phone.val().match(App.PHONE_INPUT.pattern) || $phone.val().length != 9) {
            $phone.siblings(".error-phone").addClass("active");
            $phone.focus();
            return false;
        }
        else if (!$email.val().match(App.EMAIL_INPUT.pattern) || $email.val().length == 0) {
            $email.siblings(".error-email").addClass("active");
            $email.focus();
            return false;
        }
        else {
            App.showModal();
            //alert("Submitted correctly finished");
            return true;
        }
    },
    showModal: function () {
        $("#" + App.MODAL_ID).addClass("show");
    },
    closeModal: function () {
        $(".close").on("click", function () {
            $("#" + App.MODAL_ID).removeClass("show");
            App.addNew();
            App.resetForm();
        });
    },

    addNew: function () {
        App.ID_LAST_USER++;

        var user = {
            id: App.ID_LAST_USER,
            name: $('#name').val(),
            address: {
                street: $('#street').val(),
                city: $('#city').val()
            },
            suite: $('#suite').val(),
            zipCode: $('#zip-code').val(),
            phone: $('#phone').val(),
            email: $('#email').val()
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'https://jsonplaceholder.typicode.com' + '/users',
            data: user,
            success: function (data) {
                $(".users-list").append(App.getUserBlock(user));
                console.log(data);
            }
        });
    }
};

$(document).ready(function () {
    App.init();
});