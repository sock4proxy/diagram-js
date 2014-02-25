```
{
  "name": "FlowNode",
  "superClass": "FlowElement AnotherSuperClass",
  "properties": [
    {
      "name": "outgoing",
      "type": "SequenceFlow",
      "isMany": true
    },
    {
      "name": "incoming",
      "type": "SequenceFlow",
      "association": "A_targetRef_incoming_flow",
      "id": "FlowNode-incoming",
      "isMany": true
    },
    {
      "name": "lanes",
      "type": "Lane",
      "association": "A_flowNodeRefs_lanes",
      "id": "FlowNode-lanes",
      "isVirtual": true,
      "isMany": true
    }
  ]
}
```

## Properties

### isMany

```
{
  "name": "outgoing",
  "type": "SequenceFlow",
  "isMany": true
}
```

```
<foo>
<outgoing>outGoing1</outgoing>
<outgoing>outGoing2</outgoing>
</foo>
```

### !isMany

```
{
  "name": "outgoing",
  "association": ...
  "type": "SequenceFlow"
}
```

```
<foo>
<outgoing>outGoing1</outgoing>
</foo>
```

### isRequired

```
{
  "name": "outgoing",
  "type": "SequenceFlow",
  "isRequired": true
}
```

Implication: cardinality >= 1

```
<foo>
<outgoing>outGoing1</outgoing>
</foo>
```

### @attribute

```
{
  "name": "@targetRef",
  "type": "FlowElement"
}
```

```
<foo targetRef="someFlowElement" />
```


### sub types

```
{
  "name": "subtype",
  "type": "SubType"
}
```

```
<foo>
  <subtype>
    <!-- .. -->
  </subtype>
</foo>
```

### default values

```
{
  "name": "@withDefault",
  "default": "FOO",
  "type": "String"
}
```

Possible default values: `String || Boolean || Number`

If value == default:

```
<foo />
```

else


```
<foo withDefault="BAR" />
```

### enumeration

```
{
  "name": "ProcessType",
  "literalValues": [
    {
      "name": "None"
    },
    {
      "name": "Public"
    },
    {
      "name": "Private"
    }
  ]
}
```

## General Structure


```
{
  "name": "BPMN20",
  "uri": "http://www.omg.org/spec/BPMN/20100524/MODEL-XMI",
  "associations": [], 
  "types": [],
  "enumerations": []
}
```

# Constraints

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