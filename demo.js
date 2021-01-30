/**
 * demo.js
 *
 * This is a template for how readex will work in JavaScript, and a proof of
 * concept for how it can improve a hard to read regex. The current goal of
 * this project should be to get this demo working.
 */

const { readex } = require("lib");

// From: https://stackoverflow.com/a/201378
const originalEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

// [a-z0-9!#$%&'*+/=?^_`{|}~-]+
const unquotedNameSegment = readex`
    repeat1Plus(
        oneCharOf(
            "a"-"z"
            "0"-"9"
            "\`"  // Could also use the word backtick
            "!#$%&'*+/=?^_{|}~-"
        )
    )
`

// [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*
const unquotedName = readex`
    ${unquotedNameSegment} repeat0Plus("." ${unquotedNameSegment})
`

// "(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"
const quotedName = readex`
    '"' repeat0Plus(
        | group(
            | "\x01"-"\x08"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x1f"
            | "\x21"
            | "\x23"-"\x5b"
            | "\x5d"-"\x7f"
          )
        | "\\"  // Could also use the word backslash
          group(
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
//     ${alphanumeric} optional(repeat0Plus(${alphanumeric} "-") ${alphanumeric})
// `
// or more streamlined:
const domainSegment = readex`${alphanumeric} repeat0Plus("-" ${alphanumeric})`

// (?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?
const domain = readex`repeat1Plus(${domainSegment} ".") ${domainSegment}`

// (?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))
// const ipNumber = readex`
//     | "2" group(
//         | "5"     "0"-"5"
//         | "0"-"4" "0"-"9"
//       )
//     | "1" "0"-"9" "0"-"9"
//     | optional("1"-"9") "0"-"9"
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
    repeat1Plus(
        | group(
            | "\x01"-"\x08"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x1f"
            | "\x21"-"\x5a"
            | "\x53"-"\x7f"
          )
        | "\\" group(
            | "\x01"-"\x09"
            | "\x0b"-"\x0c"
            | "\x0e"-"\x7f"
          )
    )
`

// \[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]
const ip = readex`
    "["
    repeatN(3, ${ipNumber} ".")
    group(
        | ${ipNumber}
        | ${domainSegment} ":" ${ipHexText}
    )
    "]"
`

const email = readex`
    group<username>(${username}) "@" group<tail>(
        | group<domain>(${domain})
        | group<ip>(${ip})
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
