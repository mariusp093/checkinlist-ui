var editId;

// TODO edit API url's
var API_URL = {
    CREATE: 'http://localhost:8011/check-in-list/1/passport',
    READ: 'http://localhost:8011/check-in-list/1',
    UPDATE: 'http://localhost:8011/check-in-list/1/passport/',
    DELETE: 'http://localhost:8011/check-in-list/passport/'
};

window.PhoneBook = {
    getRow: function(person) {
        // ES6 string template
        return `<tr>
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.passportNumber}</td>
            <td>
                <a href='#' data-id='${person.id}' class='delete'>&#10006;</a>
                <a href='#' data-id='${person.id}' class='edit'>&#9998;</a>
            </td>
        </tr>`;
    },

    load: function () {
        $.ajax({
            url: API_URL.READ,
            method: "GET"
        }).done(function (agenda) {
            console.info('done: agenda', agenda);

            var persons = agenda.passports;
            console.info('done:', persons);
            PhoneBook.display(persons);
        });
    },

    getActionRow: function() {
        // ES5 string concatenation
        return '<tr>' +
            '<td><input type="text" required name="firstName" placeholder="Enter first name"></td>' +
            '<td><input type="text" name="lastName" placeholder="Enter last name"></td>' +
            '<td><input type="text" required name="passportNumber" placeholder="Enter passport id"></td>' +
            '<td><button type="submit">Save</button></td>' +
            '</tr>';
    },

    delete: function(id) {
        $.ajax({
            url: API_URL.DELETE+id,
            method: "DELETE",

        }).done(function (response) {

                PhoneBook.load();

        });
    },

    add: function(person) {
        console.log(person);
        $.ajax({
            url: API_URL.CREATE,
            headers: {

                "Content-Type": "application/json"
            },
            method: "POST",
            data: JSON.stringify(person)
        }).done(function (response) {

                PhoneBook.load();

        });
    },

    save: function(person) {
        console.log(person);
        $.ajax({
            url: API_URL.UPDATE+person.id,
            method: "PUT",
            headers: {

                "Content-Type": "application/json"
            },
            data: JSON.stringify(person)
        }).done(function (response) {

                editId = '';
                PhoneBook.load();

        });
    },

    bindEvents: function() {
        $('#phone-book tbody').delegate('a.edit', 'click', function () {
            var id = $(this).data('id');
            PhoneBook.edit(id);
        });

        $('#phone-book tbody').delegate('a.delete', 'click', function () {
            var id = $(this).data('id');
            console.info('click on ', this, id);
            PhoneBook.delete(id);
        });

        $( ".add-form" ).submit(function() {
            const person = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                passportNumber: $('input[name=passportNumber]').val()
            };

            if (editId) {
                person.id = editId;
                PhoneBook.save(person);
            } else {
                PhoneBook.add(person);
            }
        });
    },

    edit: function (id) {
        // ES5 function systax inside find
        var editPerson = persons.find(function (person) {
            console.log(person.firstName);
            return person.id == id;
        });
        console.warn('edit', editPerson);

        if (editId) {
            const cancelBtn = `<button onclick="PhoneBook.cancelEdit(this)">Cancel</button>`;
            $('#phone-book tbody tr:last-child() td:last-child()').append(cancelBtn);
        }

        $('input[name=firstName]').val(editPerson.firstName);
        $('input[name=lastName]').val(editPerson.lastName);
        $('input[name=passportNumber]').val(editPerson.passportNumber);
        editId = id;
    },

    cancelEdit: function(button) {
        $( ".add-form" ).get(0).reset();
        editId = '';
        button.parentNode.removeChild(button);
    },

    display: function(persons) {
        window.persons = persons;
        var rows = '';

        // ES6 function systax inside forEach
        persons.forEach(person => rows += PhoneBook.getRow(person));
        rows += PhoneBook.getActionRow();
        $('#phone-book tbody').html(rows);
    }
};

var persons = [];
console.info('loading persons');
PhoneBook.load();
PhoneBook.bindEvents();