import {
  ruleMessages,
  styleSearch,
  report,
  whitespaceChecker
} from "../../utils"

export const ruleName = "selector-delimiter-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ","`,
  expectedAfterMultiLine: () => `Expected newline after "," in multi-line selector`,
  rejectedAfterMultiLine: () => `Unexpected space after "," in multi-line selector`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return (root, result) => {
    root.eachRule(rule => {
      // Allow for the special case of nested rule sets
      // that should be indented
      const checkLocation = (rule.parent === root)
        ? checker.after
        : checker.afterOneOnly

      const selector = rule.selector
      styleSearch({ source: selector, target: "," }, match => {
        checkLocation(selector, match.startIndex, m =>
          report({
            message: m,
            node: rule,
            result,
            ruleName,
          })
        )
      })
    })
  }
}