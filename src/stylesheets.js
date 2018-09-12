const fs = require('fs');
const path = require('path');
const encodeFont = require('./encode.js');
const { has } = require('./helpers.js');
let t = "\t\t ";
let n = "\n";
let s = " ";
let ns = "\t";

function css(minify, stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  if (minify) t = n = s = ns = "";
  const resultLines = [
    '@font-face' + s + '{',
    `${ns}font-family: "${name}";`,
    `${ns}src: url("${filename}.eot");`,
    `${ns}src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `${t}url(${woff2}) format("woff2"),`,
    `${t}url(${woff}) format("woff"),`,
    `${t}url(${ttf}) format("truetype"),`,
  ];

  if (embedSvg) {
    resultLines.push(`${t}url(${svg}) format("svg");`);
  } else {
    resultLines.push(`${t}url("${filename}.svg#${name}") format("svg");`);
  }

  resultLines.push(
    `${ns}font-style: ${style};`,
    `${ns}font-weight: ${weight};`,
    '}'
  );

  let result = resultLines.join(n);

  if (fs.existsSync(stylesheet)) result = `\n${result}`;

  fs.appendFileSync(stylesheet, result);
  return result;
}

function less(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const resultLines = [
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("truetype"),`,
  ];

  if (embedSvg) {
    resultLines.push(`         url(${svg}) format("svg");`);
  } else {
    resultLines.push(`         url("${filename}.svg#${name}") format("svg");`);
  }

  resultLines.push(
    `    font-weight: ${weight};`,
    `    font-style: ${style};`,
    '}'
  );

  let result = resultLines.join('\n');

  if (fs.existsSync(stylesheet)) result = `\n${result}`;

  fs.appendFileSync(stylesheet, result);
  return result;
}

function scss(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const resultLines = [
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("truetype"),`,
  ];

  if (embedSvg) {
    resultLines.push(`         url(${svg}) format("svg");`);
  } else {
    resultLines.push(`         url("${filename}.svg#${name}") format("svg");`);
  }

  resultLines.push(
    `         url("${filename}.svg#${name}") format("svg");`,
    `    font-weight: ${weight};`,
    `    font-style: ${style};`,
    '}'
  );

  let result = resultLines.join('\n');

  if (fs.existsSync(stylesheet)) result = `\n${result}`;

  fs.appendFileSync(stylesheet, result);
  return result;
}

module.exports = config => {
  let woff;
  let woff2;
  let ttf;
  let svg;
  let embedSvg;

  const name = config.name;
  const filename = (config.collate)
    ? path.join(config.css_fontpath, config.basename, config.basename)
    : path.join(config.css_fontpath, config.basename);
  const weight = config.weight;
  const style = config.style;

  woff2 = `"${filename}.woff2"`;
  woff = `"${filename}.woff"`;
  ttf = `"${filename}.ttf"`;

  if (has(config.embed, 'woff2')) {
    woff2 = encodeFont(config.woff2);
  }
  if (has(config.embed, 'woff')) {
    woff = encodeFont(config.woff);
  }
  if (has(config.embed, 'ttf')) {
    ttf = encodeFont(config.ttf);
  }
  if (has(config.embed, 'svg')) {
    svg = encodeFont.svg(config.svg);
    embedSvg = true;
  } else {
    embedSvg = false;
  }
  if (config.css) {
    css(config.minifycss, config.css, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
  }
  if (config.less) {
    less(config.less, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
  }
  if (config.scss) {
    scss(config.scss, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
  }
};
