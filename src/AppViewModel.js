var context = context || {};

context.AppViewModel = function () {
    var self = this;

    self.Template = "listViewTemplate";
    self.Items = ko.observableArray(context.store);
    self.Selected = ko.observableArray([context.store[2]]);
    

    setTimeout(function () {
        self.Selected([context.store[0], context.store[1]])
    }, 5000);
};
