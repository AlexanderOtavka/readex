/**
 * demo-with-functions.js
 *
 * This is an alternative demo that supports composable expressions built with
 * functions and constants we import from the library. This would work alongside
 * either of the template code versions.
 */

const {
  repeat0Plus,
  repeat1Plus,
  repeatN,
  oneCharOf,
  range,
  or,
  group,
  namedGroup,
} = require("lib");

// From: https://stackoverflow.com/a/201378
const originalEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// [a-z0-9!#$%&'*+/=?^_`{|}~-]+
const unquotedNameSegment = repeat1Plus(
  oneCharOf(
    range("a", "z"),
    range("0", "9"),
    "`", // Could also use the backtick constant
    "!#$%&'*+/=?^_{|}~-"
  )
);

// [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*
const unquotedName = group(
  unquotedNameSegment,
  repeat0Plus(".", unquotedNameSegment)
);

// "(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"
const quotedName = group(
  '"',
  repeat0Plus(
    or(
      group(
        or(
          range("\x01", "\x08"),
          range("\x0b", "\x0c"),
          range("\x0e", "\x1f"),
          "\x21",
          range("\x23", "\x5b"),
          range("\x5d", "\x7f")
        ),
        "\\" // Could also use the backslash constant
      )
    ),
    or(range("\x01", "\x09"), range("\x0b", "\x0c"), range("\x0e", "\x7f"))
  ),
  '"'
);

// (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")
const username = or(unquotedName, quotedName);

// [a-z0-9]
const alphanumeric = or(range("a", "z"), range("0", "9"));

// [a-z0-9](?:[a-z0-9-]*[a-z0-9])?
// const domainSegment = group(
//     alphanumeric, optional(repeat0Plus(alphanumeric, "-"), alphanumeric)
// )
// or more streamlined:
const domainSegment = group(alphanumeric, repeat0Plus("-", alphanumeric));

// (?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?
const domain = group(repeat1Plus(domainSegment, "."), domainSegment);

// (?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))
// const ipNumber = or(
//     group("2", or(
//         group("5",             range("0", "5")),
//         group(range("0", "4"), range("0", "9"))
//     )),
//     group("1", range("0", "9"), range("0", "9")),
//     group(optional(range("1", "9")), range("0", "9"))
// )
// or simpler:
const ipNumber = or(
  group("2", "5", range("0", "5")),
  group("2", range("0", "4"), range("0", "9")),
  group("1", range("0", "9"), range("0", "9")),
  group(range("1", "9"), range("0", "9")),
  group(range("0", "9"))
);

// (?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+
const ipHexText = repeat1Plus(
  or(
    or(
      range("\x01", "\x08"),
      range("\x0b", "\x0c"),
      range("\x0e", "\x1f"),
      range("\x21", "\x5a"),
      range("\x53", "\x7f")
    ),
    group(
      "\\",
      or(range("\x01", "\x09"), range("\x0b", "\x0c"), range("\x0e", "\x7f"))
    )
  )
);

// \[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]
const ip = group(
  "[",
  repeatN(3, ipNumber, "."),
  or(ipNumber, group(domainSegment, ":", ipHexText)),
  "]"
);

const email = group(
  namedGroup("username", username),
  "@",
  namedGroup("tail", or(namedGroup("domain", domain), namedGroup("ip", ip)))
);

const exampleEmail = "hello.there+general-kenobi@jedi.galactic-republic.gov";
const emailMatch = email.match(exampleEmail);

if (emailMatch === null) {
  console.log("The string is not a match");
} else {
  console.log(`The email "${emailMatch.detail.string}" is valid`);
  console.log(`The email has ${emailMatch.detail.subMatchCount} sub-matches`);
  console.log(`The username is "${emailMatch.username[0].detail.string}"`);

  const tailMatch = emailMatch.tail[0];
  if (tailMatch.domain.length > 0) {
    console.log(`The domain is "${tailMatch.domain[0].detail.string}"`);
    console.log(
      `The domain starts at index ${tailMatch.domain[0].detail.start}`
    );
  } else {
    console.log(`The ip is "${tailMatch.ip[0].detail.string}"`);
    console.log(`The ip starts at index ${tailMatch.ip[0].detail.start}`);
  }
}

console.log("\n--------\n");

const emailRegexMatch = originalEmailRegex.exec(exampleEmail);
console.log("Original regex match", emailRegexMatch);
