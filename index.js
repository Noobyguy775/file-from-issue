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
    const lines = section.trim().split('\n')
    lines.shift()
    lines.shift()
    fields.push(lines.join('\n'))
  }

  const name = payload.issue.title
  const author = fields[1]
  const description = fields[2]

  const ahkCodeblock = /```ahk(?<code>[\s|\S]*?)```/;

  const pattern = ahkCodeblock.exec(fields[0]).groups.code.trim()

  const fileContent = [
    `/************************************************************************`,
    ` * @name ${name}`,
    ` * @description ${description}`,
    ` * @author ${author}`,
    ` ***********************************************************************/`,
    ``,
    pattern
  ].join("\n");

  const identifier = sanitize(`${author}-${name}`)

  const folderPath = path.join('patterns/custom', identifier)

  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, `${identifier}.ahk`);

  fs.writeFileSync(filePath, fileContent);
  core.info(`File created at ${filePath}`);
} catch (error) {
  core.setFailed(error.message);
}