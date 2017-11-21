# Knockout-Kendo ListView binding

The KendoUI ListView control does not expose a more direct way to work with selected items. That's because <em><a href="https://www.telerik.com/forums/how-to-select-listview-item-by-it-s-id-in-the-model#jcypkeu-HEuQeYc_UuFrgw">the ListView selection relies only on DOM elements [...]</a></em>. As a result, the Knockout-Kendo binding also does not have this functionality. 

# Features
I needed my ListView controls to be able to do basic things: show items and select them. In a KnockoutJS-KendoUI-KnockoutKendo context, this translates into a custom binding. 

Right now is not so smart, it only supports
* selected items
* KO templates

but it can easily be extended/modified. I'll do it if I'll find time.
Check the index.html to see it in action.

# Dependencies
This is a <strong>KnockoutJS</strong> binding that extends the <strong>Knockout-Kendo</strong> binding of a <strong>Kendo UI</strong> ListView control. 
Check the <a href="https://github.com/kendo-labs/knockout-kendo#compatibility-and-requirements">Knockout-Kendo requirements section</a> for more information.

# See it in action
Just download the ZIP, extract it and open the index.html in your favorite brouser.

<hr/>
I hope it helps, at least by making an idea of what needs to be done in order to achieve the required result. 
