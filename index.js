import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "node:fs"
import path from "node:path";
import sanitize from "sanitize-filename";

try {
  const payload = github.context.payload;
  const sections = payload.issue.body.split('###');
  const fields = []
  sections.shift() // since it'll always be empty

  for (const section of sections) {
    fields.push(
        section.split('\n').shift().shift().join('\n').trim() // removes the first two lines and preserves the rest
    )
  }

  const name = payload.issue.title
  const pattern = fields[1]
  const author = fields[2]
  const description = fields[3]

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