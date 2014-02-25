# JSON Meta Model

A [JSON](http://json.org/) notation for describing complex (xml-like) meta models.


## Overview

Use the notation to describe elements, including their properties, associations and type information.

```
{
  "name": "SomeElement",
  "superClass": "SomeParent SomeOtherParent",
  "properties": [
    {
      "name": "@someAttribute",
      "type": "String"
    },
    {
      "name": "subType",
      "type": "ContainedChild"
    },
    {
      "name": "referencedType",
      "type": "SomeReferencedElement",
      "association": "ReferencedElement-type-to-referencedType",
      "isVirtual": true,
      "isMany": true
    }
  ]
}
```

Combine all known types into a package that has a well defined namespace.

```
{
  "name": "MYNS",
  "uri": "http://my.ns",
  "associations": [], 
  "types": [],
  "enumerations": []
}
```

## Types

A type is a well defined element with a certain structure.

It consists of a `name` a list of `superClass`es and a number of `properties`.



## Properties

Specify properties of an element within the `properties = []` tag.

A number of markers may help to further specify each property.


### @attribute

All properties with a name starting with `@` are attributes.
Other properties are nested, i.e. nested or referenced entities.

```
{
  "name": "@targetRef",
  "type": "FlowElement"
}
```

```
<element targetRef="someFlowElement" />
```


### Nested / referenced Elements

Properties not preceeded by an `@` are nested or referenced entities.

Whether elements are embedded or referenced depends on the `association = { ... }` property.


#### Example

*   Nested elements

    ```
    {
      "name": "subtype",
      "type": "SubType"
    }
    ```
    
    ```
    <element>
      <subtype>
        <!-- ... -->
      </subtype>
    </element>
    ```

*   Referenced Elements

    ```
    {
      "name": "referencedSubtype",
      "type": "SubType",
      "association": { ... }
    }
    ```
    
    ```
    <element>
      <referencedSubtype>SubType_ID</referencedSubtype>
    </element>
    ```


### isMany

Use `isMany = true || false` to denote whether a property is a collection or not.

Definition: `isMany = `

*   `true`: property exists `0..1` times
*   `false`: property exists `0..n` times and is represented through a collection of elements

#### Examples

*   __isMany = true__
    
    ```
    {
      "name": "collectionProperty",
      "type": "CollectionElement",
      "isMany": true
    }
    ```
    
    ```
    <element>
      <collectionProperty><!-- ... --></collectionProperty>
      <collectionProperty><!-- ... --></collectionProperty>
    </element>
    ```

*   __isMany = false (default)__

    ```
    {
      "name": "singleProperty",
      "type": "ContainedElement"
    }
    ```
    
    ```
    <element>
      <singleProperty><!-- ... --></singleProperty>
    </element>
    ```


### isRequired

Use `isRequired = true || false` to specify whether a property must exist or not.

_Exists_ means cardinality `>= 1`.


#### Example

```
{
  "name": "mandatoryProperty",
  "type": "SomeElement",
  "isRequired": true
}
```

```
<element>
  <outgoing>outGoing1</outgoing>
</element>
```


### Default Values

Specify property default values via `default = aValue`.

Possible default value types are `String`, `Number` or `Boolean`.

A value will be serialized only if it does not match the default value.


#### Example

```
{
  "name": "@withDefault",
  "default": "FOO",
  "type": "String"
}
```

*   __value == default__

    ```
    <element />
    ```

*   __value != default__

    ```
    <element withDefault="BAR" />
    ```


### Enumeration

An enumeration contains a set of possible values for a property.

Use the `literalValues` field to specify all possible values.


#### Example

```
{
  "name": "Choice",
  "literalValues": [
    {
      "name": "Yes"
    },
    {
      "name": "No"
    },
    {
      "name": "Maybe"
    }
  ]
}
```


## Constraints

```
{
  name: 'FOO',
  properties: [
    {
       "name": "@option1",
       "type": "String"
    },
    {
      "name": "@option2",
      "type": "String"
    }
  ],
  constraints: [
    { 'type': 'exclusive', values: ['@option1', '@option2'] }
  ]
}
```
