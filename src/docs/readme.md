## This is a custom *language* to describe routes
# Global
Everything turns around the concept of schema.
A schema describes a piece of data type.

A schema has a `name`, `description`, `type` and other parameters.
The **name** is the unique identifier of the data to be exchanged. The **description**, as the name suggest, describes the schema.
The **type** will inform about the kind of the data.

A type can be simple (e.g string, number) or complex.
Complex types are:
* object
* array
* enum

This is how to define a simple schema:
```javascript 1.8
const usernameDoc = {
    name: "username",
    description: "The unique identifier of the user (pseudonym)",
    type: "string"
}
```
It is possible to add, `format`, `default`, `example`, `required` to the definition.

## Object

Defining an object is like defining a simple schema. But the type must be `object` and it must have `properties`.
This last, is an array of schema descriptions (recursive). Each one defines fields that will belong to that object.

This is an example of an object schema definition:
```javascript 1.8
const userDoc = {
   name: "user",
   type: "object",
   description: "A connected user in the system",
   properties: [
       {
           name: "username",
           description: "The unique identifier of the user (pseudonym)",
           type: "string",
           required: true
       },
       {
           name: "firstName",
           description: "The first name of the user",
           type: "string"
       },
       {
           name: "lastName",
           description: "The last name of the user",
           type: "string"
       }
   ] 
}
```

## Array
This is used when we need to define a list of elements. Elements must be the same type (which can be simple or complex).
To define an array, we set the type to `array` and use the field `items` to describe the type of its items.

In `items`, we can use a string for simple types like `string`, `number`, or a complete schema description.
Examples:
```javascript 1.8
const tagsDoc = {
    name: "tags",
    description: "Tags used",
    type: "array",
    items: "string"
}

const friendsDoc = {
    name: "friends",
    description: "Tags used",
    type: "array",
    items: {
      name: "user",
      type: "object",
      description: "A connected user in the system",
      properties: [
          {
              name: "username",
              description: "The unique identifier of the user (pseudonym)",
              type: "string",
              required: true
          },
          {
              name: "firstName",
              description: "The first name of the user",
              type: "string"
          },
          {
              name: "lastName",
              description: "The last name of the user",
              type: "string"
          }
      ]
    }
}
```
## Enum
Enumerations are used to tell that a data is one of a list of defined values. This values simple types (eg. string, number).

To define an enum, we use this syntax on the type: `enum:<eType>` where `eType` denote the type of elements in the enum.

For example to define enumeration of string values we can do it like that:
```javascript 1.8
const regionDoc = {
    description: "The region of the world",
    name: "region",
    default: "us",
    type: "enum:string",
    items: [
      "us", "uk", "eu", "ca", "au", "nz", "sg", "za", "zz"
    ]
}
```

# Path parameters

# Query parameters

# Request body

# Response body