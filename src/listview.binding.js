ko.bindingHandlers.listView = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, $context) {
        var options = ko.unwrap(valueAccessor()),
            allItems = options.data,
            selectedItems = options.selected,
            selectable = options.selectable || 'true',
            template = options.template || {},
            item = options.item || {},
            itemKey = item.key || 'id',
            itemName = item.name || 'name',
            listViewWidget = ko.observable();

        // #region Utils

        // Returns true if two primitive values are equal. False otherwise.
        var valuesAreEqual = function (a, b) {
            return (a || "").toString().toLowerCase() === (b || "").toString().toLowerCase();
        };

        // Builds the list of widget's selected items
        var computeSelectionFromUI = function (widget) {
            var wdg = widget || listViewWidget(),
                data = wdg.dataSource.view(),
                selected = $.map(wdg.select(), function (item) {
                    return data[$(item).index()]._raw();
                });

            return selected;
        };

        // Builds the list of widget's TO-BE selected items
        var computeSelectionFromVM = function (widget) {
            var wdg = widget || listViewWidget(),
                uiCurrent = wdg.dataSource.view(),
                vmCurrent = getSelectedVmItems(),
                selected = [],
                currentDomElement, currentVmElement;

            for (var i = 0; i < uiCurrent.length; i++) {
                currentDomElement = uiCurrent[i];
                if (ko.utils.arrayFirst(vmCurrent, function (e) {
                        return valuesAreEqual(currentDomElement[itemKey], e[itemKey]);
                    })) {
                    selected.push(wdg.element.children()[i]);
                }
            }

            return selected;
        };

        // Returns a boolean value indicating whether or not the selection has changed.
        var selectionHasChanged = function () {
            var currentElements = computeSelectionFromUI(),
                selectedElements = getSelectedVmItems(),
                tempElement;

            // different lengths --> selection changed
            if (currentElements.length !== selectedElements.length) {
                return true;
            }

            // check ui --> vm
            for (var i = 0; i < currentElements.length; i++) {
                tempElement = ko.utils.arrayFirst(selectedElements, function (s) {
                    return valuesAreEqual(s[itemKey], currentElements[i][itemKey]);
                });
                if (!tempElement) {
                    return true;
                }
            }

            // check vm --> ui
            for (var i = 0; i < selectedElements.length; i++) {
                tempElement = ko.utils.arrayFirst(currentElements, function (c) {
                    return valuesAreEqual(c[itemKey], selectedElements[i][itemKey]);
                });
                if (!tempElement) {
                    return true;
                }
            }

            // If we get here, then the selection is current.
            return false;
        };

        // Sets up any dependencies
        var dependenciesSetup = function () {
            // subscribe to VM selectedItems array changes, in order to reflect the changes in UI
            if (ko.isObservable(selectedItems) && !!selectedItems.push) {
                vmSelectionChangedSubscription = selectedItems.subscribe(function () {
                    if (selectionHasChanged()) {
                        selectUIItems();
                    }
                });
            }
        }

        // The item list can be observable or not, so make sure we always work with valid data.
        var getSelectedVmItems = function () {
            if (ko.isObservable(selectedItems)) {
                return selectedItems.peek();
            } else {
                return selectedItems || [];
            }
        };

        // Updates UI selection based on VM data
        var selectUIItems = function (widget) {
            var wdg = widget || listViewWidget(),
                selected = computeSelectionFromVM(widget);

            wdg.clearSelection();
            wdg.select(selected);
        };

        // Updates VM data based on UI selection
        var selectVMItems = function (widget) {
            selectedItems(computeSelectionFromUI(widget));
        };
        //#endregion

        // #region Binding settings

        // Apply KO bindings
        ko.applyBindingsToNode(element, {
            kendoListView: {
                widget: listViewWidget,
                data: allItems,
                selectable: selectable,
                template: template.value,
                useKOTemplates: template.useKo,
                change: function (e) {
                    selectVMItems(this);
                },
                dataBound: function () {
                    this.select(computeSelectionFromVM(this));
                    dependenciesSetup();
                },
            }
        }, $context);

        // Cleanup
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (listViewWidget()) {
                listViewWidget().destroy();
            }

            if (vmSelectionChangedSubscription) {
                if (!vmSelectionChangedSubscription.isDisposed()) {
                    vmSelectionChangedSubscription.dispose();
                }
                vmSelectionChangedSubscription = null;
            }
        });

        //#endregion

        return {
            controlsDescendantBindings: true
        };
    }
};