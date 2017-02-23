/**
 * Created by Michał_2 on 2016-12-19.
 */

var App = {
    //variables
    CLICK_EVENT: "click",
    FOCUSOUT_EVENT: "focusout",
    FORM_ID: "#user-form",
    USERS_LIST_CL: ".users-list",
    NEW_USER_CL: ".new-user",
    MODAL_ID: "#modal",
    SUBMIT_BUTTON_ID: "#submit",
    DELETE_BUTTON_ID: "#delete",
    ID_LAST_USER: 0,
    URL: 'https://jsonplaceholder.typicode.com/users/',
    FORM_INPUT_ID: {
        name: '#name',
        street: '#street',
        city: '#city',
        suite: '#suite',
        zipCode: '#zip-code',
        phone: '#phone',
        email: '#email'
    },
    MIN_INPUT: {
        pattern: /[a-zA-Z]{3,}/,
        typeError: ".error-chars"
    },
    ZIP_CODE_INPUT: {
        pattern: /([0-9]{2}[-/s][0-9]{3})/,
        typeError: ".error-zipcode"
    },
    PHONE_INPUT: {
        pattern: /([0-9])\w/,
        typeError: ".error-phone"
    },
    EMAIL_INPUT: {
        pattern: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/,
        typeError: ".error-email"
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
        $(App.SUBMIT_BUTTON_ID).on(App.CLICK_EVENT, function (event) {
            event.preventDefault();
            App.formValid();
            console.log("correct");
        });
    },

    checkFocusOut: function () {
        console.log("validate inputs");
        $(App.FORM_ID + " " + App.FORM_INPUT_ID.name).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.name, App.MIN_INPUT);
        });

        $(App.FORM_ID + " " + App.FORM_INPUT_ID.street).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.street, App.MIN_INPUT);
        });

        $(App.FORM_ID + " " + App.FORM_INPUT_ID.city).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.city, App.MIN_INPUT);
        });

        $(App.FORM_ID + " " + App.FORM_INPUT_ID.suite).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.suite, App.MIN_INPUT);
        });

        $(App.FORM_ID + " " + App.FORM_INPUT_ID.zipCode).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.zipCode, App.ZIP_CODE_INPUT);
        });

        $(App.FORM_ID + " " + App.FORM_INPUT_ID.phone).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.phone, App.PHONE_INPUT);
        });

        $(App.FORM_ID + " " + App.FORM_INPUT_ID.email).on(App.FOCUSOUT_EVENT, function () {
            App.focusValid(App.FORM_INPUT_ID.email, App.EMAIL_INPUT);
        });
    },

    //function
    getUsers: function () {
        $.ajax({
            url: App.URL,
            method: 'GET',
            success: function (data) {
                App.drawUsers(data);
            },
            error: function () {
                console.log("Getting data error");
            }
        });
    },

    resetForm: function () {
        var resetIt = function () {
            $(App.FORM_ID)[0].reset();
        };
        setTimeout(resetIt, 3000);
    },

    drawUsers: function (data) {
        var template = "";
        $.each(data, function (index, item) {
            template += App.getUserBlock(item);
            App.ID_LAST_USER++;
        });
        $(App.USERS_LIST_CL).prepend(template);
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
        block += '<button class="btn-remove" onclick="App.removeUser(' + data.id + ', event.target)">Remove</button>';
        block += '<button class="btn-edit" onclick="App.editUser(event.target)">Edit</button>';
        block += '<button class="btn-cancel" onclick="App.cancelAction(event.target)">Cancel</button>';
        block += '<button class="btn-save" onclick="App.sendChange(' + data.id + ', event.target)">Save</button>';
        block += '</div>';
        console.log(event.target);
        return block;
    },

    //remove single user block
    removeUser: function (itemId, e) {
        $.ajax({
            url: App.URL + itemId,
            dataType: 'json',
            contentType: 'application/json',
            data: {'action': 'delete'},
            success: function () {
                $(e).parent().remove();
                alert("User was removed !");
            }
        });
    },

    //exchange attribute of input (disable true/false)
    editUser: function (e) {
        var element = $(e).closest(App.NEW_USER_CL);
        element.addClass("edit show cancel");
        element.find(".input-box > input").prop("disabled", false);
    },

    cancelAction: function (e) {
        var element = $(e).closest(App.NEW_USER_CL);
        element.removeClass("edit show cancel");
        element.find(".input-box > input").prop("disabled", true);
    },

    //confirm change data user
    sendChange: function (buttonId, e) {
        $.ajax({
            url: App.URL + buttonId,
            method: 'PUT',
            data: {
                name: $(e).closest(App.NEW_USER_CL).find(".input-box > input[name=name]").val(),
                street: $(e).closest(App.NEW_USER_CL).find(".input-box > input[name=street]").val(),
                city: $(e).closest(App.NEW_USER_CL).find(".input-box > input[name=city]").val(),
                phone: $(e).closest(App.NEW_USER_CL).find(".input-box > input[name=phone]").val()
            },
            success: function (data) {
                console.log(data);
                console.log(e);
                var element = $(e).closest(App.NEW_USER_CL);
                element.find(".input-box > input").prop("disabled", true);
                element.removeClass("edit show cancel");
            },
            error: function () {
                console.log("%c Sending data error", "background-color: red; color: #fff");
            }
        });
    },

    //remove all users blocks
    deleteAll: function () {
        $(App.DELETE_BUTTON_ID).on(App.CLICK_EVENT, function () {
            var confirmation = confirm("Are you sure to delete?");
            if (confirmation) {
                $(App.NEW_USER_CL).remove();
            } else {
                return false;
            }
        });
    },

    //Show under the input error message
    throwMessage: function (element, type) {
        $(element).siblings(type).addClass("active");
    },

    //Hide error message
    destroyMessage: function (element, type) {
        $(element).siblings(type).removeClass("active");
    },

    // input = "#name";
    // alert = /[a-zA-Z]{3,}/  &  "please enter 3 chars"
    focusValid: function (input, alert) {
        console.log(input);
        console.log(alert);
        var name = $(input).val();
        if (!name.match(alert.pattern) || name.length == 0) {
            App.throwMessage(input, alert);
            return false;
        } else {
            App.destroyMessage(input, alert);
            return true;
        }
    },

    formValid: function () {
        if (App.focusValid(App.FORM_INPUT_ID.name, App.MIN_INPUT) ||
            App.focusValid(App.FORM_INPUT_ID.street, App.MIN_INPUT) ||
            App.focusValid(App.FORM_INPUT_ID.city, App.MIN_INPUT) ||
            App.focusValid(App.FORM_INPUT_ID.suite, App.MIN_INPUT) ||
            App.focusValid(App.FORM_INPUT_ID.zipCode, App.ZIP_CODE_INPUT) ||
            App.focusValid(App.FORM_INPUT_ID.phone, App.PHONE_INPUT) ||
            App.focusValid(App.FORM_INPUT_ID.email, App.EMAIL_INPUT)) {
            App.showModal();
        }
    },

    showModal: function () {
        $(App.MODAL_ID).addClass("show");
    },

    closeModal: function () {
        $(".close").on("click", function () {
            $(App.MODAL_ID).removeClass("show");
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
            url: App.URL,
            data: user,
            success: function (data) {
                $(App.USERS_LIST_CL).append(App.getUserBlock(user));
                console.log(data);
            }
        });
    }
};

$(document).ready(function () {
    App.init();
});