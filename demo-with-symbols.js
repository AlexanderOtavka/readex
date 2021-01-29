/**
 * demo.js
 *
 * This is an alternate demo that partially abandons the goal of verbosity in
 * favor of brevity. Common operations use similar syntax to normal regular
 * expressions, except operations are prefixed rather than postfixed and some
 * symbols are changed.
 */

const { readex } = require("lib");

// From: https://stackoverflow.com/a/201378
const originalEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

// [a-z0-9!#$%&'*+/=?^_`{|}~-]+
const unquotedNameSegment = readex`
    1+[
        "a"-"z"
        "0"-"9"
        "\`"  // Could also use the word backtick
        "!#$%&'*+/=?^_{|}~-"
    ]
`

// [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*
const unquotedName = readex`
    ${unquotedNameSegment} *("." ${unquotedNameSegment})
`

// "(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"
const quotedName = readex`
    '"' *(
        | (
            | "\x01"-"\x08"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x1f"
            | "\x21"
            | "\x23"-"\x5b"
            | "\x5d"-"\x7f"
          )
        | "\\"  // Could also use the word backslash
          (
            | "\x01"-"\x09"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x7f"
          )
    ) '"'
`

// (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")
const username = readex`${unquotedName} | ${quotedName}`

// [a-z0-9]
const alphanumeric = readex`"a"-"z" | "0"-"9"`

// [a-z0-9](?:[a-z0-9-]*[a-z0-9])?
// const domainSegment = readex`
//     ${alphanumeric} ?(*(${alphanumeric} "-") ${alphanumeric})
// `
// or more streamlined:
const domainSegment = readex`${alphanumeric} *("-" ${alphanumeric})`

// (?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?
const domain = readex`1+(${domainSegment} ".") ${domainSegment}`

// (?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))
// const ipSegment = readex`
//     | "2" (
//         | "5"     "0"-"5"
//         | "0"-"4" "0"-"9"
//       )
//     | "1" "0"-"9" "0"-"9"
//     | ?("1"-"9") "0"-"9"
// `
// or simpler:
const ipNumber = readex`
    | "2" "5"     "0"-"5"
    | "2" "0"-"4" "0"-"9"
    | "1" "0"-"9" "0"-"9"
    |     "1"-"9" "0"-"9"
    |             "0"-"9"
`

// (?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+
const ipHexText = readex`
    1+(
        | (
            | "\x01"-"\x08"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x1f"
            | "\x21"-"\x5a"
            | "\x53"-"\x7f"
          )
        | "\\" (
            | "\x01"-"\x09"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x7f"
          )
    )
`

// \[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]
const ip = readex`
    "["
    3(${ipNumber} ".")
    (
        | ${ipNumber}
        | ${domainSegment} ":" ${ipHexText}
    )
    "]"
`

const email = readex`
    <username>${username} "@" <tail>(
        | <domain>${domain}
        | <ip>${ip}
    )
`

const exampleEmail = "hello.there+general-kenobi@jedi.galactic-republic.gov"
const emailMatch = email.match(exampleEmail)

if (emailMatch === null) {
    console.log("The string is not a match")
} else {
    console.log(`The email "${emailMatch.detail.string}" is valid`)
    console.log(`The email has ${emailMatch.detail.subMatchCount} sub-matches`)
    console.log(`The username is "${emailMatch.username[0].detail.string}"`)

    const tailMatch = emailMatch.tail[0]
    if (tailMatch.domain.length > 0) {
        console.log(`The domain is "${tailMatch.domain[0].detail.string}"`)
        console.log(`The domain starts at index ${tailMatch.domain[0].detail.start}`)
    } else {
        console.log(`The ip is "${tailMatch.ip[0].detail.string}"`)
        console.log(`The ip starts at index ${tailMatch.ip[0].detail.start}`)
    }
}

console.log("\n--------\n")

const emailRegexMatch = originalEmailRegex.exec(exampleEmail)
console.log("Original regex match", emailRegexMatch)
