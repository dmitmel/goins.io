# lib/object-schema.js Tutorial

This module is lightweight object type validator. It's very useful in JSON/REST Web APIs
to validate requests with JSON data.

## Example

```javascript
import schema from 'lib/object-schema';    // Or ./lib/object-schema in project context

const userSchema = {
    users: schema.required(schema.Array(
        schema.Object({
            name: schema.required(schema.minLength(3, schema.maxLength(30, schema.AlphanumString))),
            password: schema.required(rschema.egexp(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/)),
            email: schema.required(schema.Email),
            status: schema.optional(schema.NotEmptyString),
            id: schema.required(schema.AlphanumString),
            friends: schema.optional(schema.Array(schema.AlphanumString))
        })
    ))
}

var result = schema.validate(..., userSchema);
```

Function `schema.validate` is described in [documentation](./module-lib_object-schema.html).

## Schema Structure

Schema is an object, where keys are property names, and values are type predicates. Type
predicate is a function that takes object and property name (`(object, prop) => ...`),
checks it, and returns array of errors. You can use function `checkValue`
(`checkValue((value, prop) => ...)`) to create type predicates easier.

<table class="table table-striped">
    <caption>List of built-in type predicates</caption>
    <thead>
        <tr>
            <th>Type name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`AlphanumString`</td>
            <td>Alpha-numeric string</td>
        </tr>
        <tr>
            <td>`Any`</td>
            <td>Any type</td>
        </tr>
        <tr>
            <td>`Array(...)`</td>
            <td>Checks each value in array using predicate</td>
        </tr>
        <tr>
            <td>`Boolean`</td>
            <td>Boolean</td>
        </tr>
        <tr>
            <td>`Email`</td>
            <td>Email</td>
        </tr>
        <tr>
            <td>`Enum(a, b, c)`</td>
            <td>Enum</td>
        </tr>
        <tr>
            <td>`Function`</td>
            <td>Function</td>
        </tr>
        <tr>
            <td>`IntegerString`</td>
            <td>String with integer literal</td>
        </tr>
        <tr>
            <td>`NotEmptyArray(...)`</td>
            <td>Like `Array(...)`, but not empty</td>
        </tr>
        <tr>
            <td>`NotEmptyString`</td>
            <td>Like `String`, but not empty</td>
        </tr>
        <tr>
            <td>`Number`</td>
            <td>Number</td>
        </tr>
        <tr>
            <td>`NumberString`</td>
            <td>String with integer or float literal</td>
        </tr>
        <tr>
            <td>`Object({...})`</td>
            <td>Takes schema and validates property</td>
        </tr>
        <tr>
            <td>`String`</td>
            <td>String</td>
        </tr>
        <tr>
            <td>`regexp(/abc/)`</td>
            <td>Checks if string matches regexp</td>
        </tr>
    </tbody>
</table>

Also, there're some type decorators. Type decorators are functions, that take type predicate
(and, maybe, some arguments) and return new type predicate with new effect.

<table class="table table-striped">
    <caption>List of built-in type decorators</caption>
    <thead>
        <tr>
            <th>Type decorators</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`and`</td>
            <td>types (rest parameters, not array)</td>
            <td>If first type check succeeded - check second type, otherwise - return errors. Then continue this operation with 2nd, 3rd, 4th type, and so on.</td>
        </tr>
        <tr>
            <td>`conditional`</td>
            <td>condition (function or boolean), error message (function or string) and type</td>
            <td>if property isn’t `undefined` or `null` and condition is `true` - check type, otherwise (if property isn’t `undefined` or `null`) - throw error.</td>
        </tr>
        <tr>
            <td>`max`</td>
            <td>max value and type</td>
            <td>If value is greater than max value - throw error, otherwise - check type.</td>
        </tr>
        <tr>
            <td>`maxLength`</td>
            <td>max length and type</td>
            <td>If length of value is greater than max value - throw error, otherwise - check type.</td>
        </tr>
        <tr>
            <td>`min`</td>
            <td>min value and type</td>
            <td>If value is less than min value - throw error, otherwise - check type.</td>
        </tr>
        <tr>
            <td>`minLength`</td>
            <td>min length and type</td>
            <td>If length of value is less than min value - throw error, otherwise - check type.</td>
        </tr>
        <tr>
            <td>`optional`</td>
            <td>type</td>
            <td>if property is `undefined` or `null` - don’t do anything, otherwise - check type.</td>
        </tr>
        <tr>
            <td>`required`</td>
            <td>type</td>
            <td>if property is `undefined` or `null` - return error, otherwise - check type.</td>
        </tr>
    </tbody>
</table>
