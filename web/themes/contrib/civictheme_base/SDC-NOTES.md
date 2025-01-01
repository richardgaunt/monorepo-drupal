## Single directory components

Single Directory components can work seamlessly with components contrib module.
We can convert one by one to SDC once we convert the css for that component is unbundled from the `dist/styles.css` and
gets included as a SDC component
We can refer to other SDC components from within other components, we do not need to update everything to use slots.


## Conversion Process

1. Create a *.component.yml
2. Search and update to update namespace `civictheme_base:<component_directory_name>` from `(atoms|molecules|organism)/<component_directory_name>`
3. Go to page rendering component, see if error messages

### Types of error messages

#### Slot and property naming collisions

We often use property - {{ content }} and slot - {%block content %} interchangeably (like core Drupal!!).

We want to change this - for the slot `content` we want to change to `content_main`, for others offer suggestions
and update the theme code to fix - we also want to push these up to UI Kit (if we are still maintaining in this process)

#### Unused properties where there should be

We want to explicitly pass the required properties to each component not rely on implicit passing so add only to all
include statements.

If we are doing a paragraph component we need to make sure the property is being set in the preprocess, if the rest of
the preprocess is using utility classes to provide, then add one for this if it is reused across many preprocesses.

