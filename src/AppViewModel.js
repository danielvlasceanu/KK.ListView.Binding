var context = context || {};

context.AppViewModel = function () {
    var self = this;

    self.Template = "listViewTemplate";
    self.Items = ko.observableArray(context.store);
    self.Selected = ko.observableArray([context.store[2]]);

    // Change selection
    setTimeout(function () {
        self.Selected([context.store[0], context.store[1]])
    }, 3000);

    // Change item source
    setTimeout(function () {
        self.Items.push.apply(self.Items, [
            { id: self.Items().length + 1, name: 'Banana' },
            { id: self.Items().length + 2, name: 'Strawberry' }
        ]);
    }, 6000);
};
