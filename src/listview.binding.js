ko.bindingHandlers.listView = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, $context) {
        var options = ko.unwrap(valueAccessor()),
            // binding info
            allItems = options.data,
            selectedItems = options.selected,
            selectable = options.selectable || 'true',
            template = options.template || {},
            item = options.item || {},
            itemKey = item.key || 'id',
            itemName = item.name || 'name',
            listViewWidget = ko.observable(),
            binding,
            // utils
            getUISelection, getVMSelection,
            valuesAreEqual, checkSelectionChanged, getSelectedVmItems,
            syncSelectionVmToWidget, syncSelectionWidgetToVm,
            vmSelectionSubscriptionSetup, vmSelectionChangedSubscription;

        valuesAreEqual = function (a, b) {
            return (a || "").toString().toLowerCase() === (b || "").toString().toLowerCase();
        };

        getUISelection = function (widget) {
            var wdg = widget || listViewWidget(),
                data = wdg.dataSource.view(),
                selected = $.map(wdg.select(), function (item) {
                    return data[$(item).index()];
                });

            return selected;
        };
        getVMSelection = function (widget) {
            var wdg = widget || listViewWidget(),
                current = wdg.dataSource.view(),
                selected = [],
                currentDomElement, currentVmElement;

            for (var i = 0; i < current.length; i++) {
                currentDomElement = current[i];
                if (ko.utils.arrayFirst(getSelectedVmItems(), function (e) {
                        return valuesAreEqual(currentDomElement[itemKey], e[itemKey]);
                    })) {
                    selected.push(wdg.element.children()[i]);
                }
            }

            return selected;
        };

        checkSelectionChanged = function () {
            var currentElements = getUISelection(),
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

            return false;
        };

        vmSelectionSubscriptionSetup = function () {
            if (ko.isObservable(selectedItems) && !!selectedItems.push) {
                vmSelectionChangedSubscription = selectedItems.subscribe(function (newValue) {
                    if (checkSelectionChanged()) {
                        syncSelectionVmToWidget();
                    }
                });
            }
        }

        getSelectedVmItems = function () {
            if (ko.isObservable(selectedItems)) {
                return selectedItems.peek();
            } else {
                return selectedItems || [];
            }
        };
        syncSelectionVmToWidget = function (widget) {
            var wdg = widget || listViewWidget(),
                selected = getVMSelection(widget);

            wdg.clearSelection();
            wdg.select(selected);
        };
        syncSelectionWidgetToVm = function (widget) {
            var selected = getUISelection(widget);
            selectedItems(selected);
        };

        binding = {
            widget: listViewWidget,
            data: allItems,
            selectable: selectable,
            template: template.value,
            useKOTemplates: template.useKo,
            change: function (e) {
                syncSelectionWidgetToVm(this);
            },
            dataBound: function () {
                this.select(getVMSelection(this));
                vmSelectionSubscriptionSetup();
            }
        };

        ko.applyBindingsToNode(element, {
            kendoListView: binding
        }, $context);

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

        return {
            controlsDescendantBindings: true
        };
    }
};