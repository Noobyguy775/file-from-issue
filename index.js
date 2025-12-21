import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "node:fs"
import path from "node:path";
import sanitize from "sanitize-filename";

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
    core.info(payload);
    return;

  const author = payload.issue.issue_field_values.author
  const name = payload.issue.title
  const description = payload.issue.issue_field_values.description
  const pattern = payload.issue.issue_field_values.pattern

  const fileContent = [
    `/************************************************************************`,
    ` * @name ${name}`,
    ` * @description ${description}`,
    ` * @author ${author}`,
    ` ***********************************************************************/`,
    ``,
    pattern
  ].join("\n");

  const filePath = path.join('/patterns/custom', sanitize(`${author}-${name}`))

  fs.writeFileSync(filePath, fileContent);
  core.info(`File created at ${filePath}`);
} catch (error) {
  core.setFailed(error.message);
}