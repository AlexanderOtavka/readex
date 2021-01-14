# ReadEx
> Readable regular expressions

See `demo.js` for an example of the ways ReadEx can improve an ugly,
unreadable regular expression.

## Goals

1. **Composability.** ReadExes should be able to combine other ReadExes so indiviual component patterns can be named and reused.
2. **Free Formatting.** ReadExes should only pay attention to whitespace when it is explicitly quoted and called out. All other whitespace should be ignored to allow free formatting by the programmer.
3. **Verbosity.** ReadExes should use full names rather than obscure symbols and single letters to denote patterns and operations. Comments should be allowed.
