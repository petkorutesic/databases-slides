#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

let md_files = fs.readdirSync(".").filter((file) => path.extname(file).toLowerCase() === ".md")

for (f of md_files)
	console.log(`- <a href='./?${f}'>${path.basename(f, ".md")}</a> (<a href='./?${f}/print-pdf'>printable version</a>)`)