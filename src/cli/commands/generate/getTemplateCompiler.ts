import { readFileSync } from "fs";
import path from "path";
import type { Config, OriginRoute } from "~/cli/types";
import type { RouteType } from "./getOriginRoutes";

type PatternKey = (typeof PATTERN_KEYS)[number];
const PATTERN_KEYS = ["routeType", "relativePath", "locale"] as const;
const PATTERNS = Object.fromEntries(
  PATTERN_KEYS.map((key) => [key, `{{${key}}}`])
) as Record<PatternKey, string>;

export function compileTemplate(
  template: string,
  params: Record<PatternKey, string>
) {
  let comiledContents = template;
  PATTERN_KEYS.forEach((key) => {
    comiledContents = comiledContents.replaceAll(PATTERNS[key], params[key]);
  });
  return comiledContents;
}

const baseTemplate = ""
  .concat(
    "// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n",
    "// @ts-nocheck\n\n",
    'import { setLocale } from "next-i18n-gen";\n',
    `import Origin${PATTERNS.routeType} from "${PATTERNS.relativePath}";\n\n`,
    `export default function ${PATTERNS.routeType}(props) {\n`,
    `\tsetLocale("${PATTERNS.locale}");\n`,
    `\treturn <Origin${PATTERNS.routeType} {...props} />;\n}`
  )
  .trim();

const layoutTemplate = ""
  .concat(
    "// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n",
    "// @ts-nocheck\n\n",
    'import { LocaleProvider, setLocale } from "next-i18n-gen";\n',
    `import Origin${PATTERNS.routeType} from "${PATTERNS.relativePath}";\n\n`,
    `export default function ${PATTERNS.routeType}(props) {\n`,
    `\tsetLocale("${PATTERNS.locale}");\n`,
    "\treturn (\n",
    `\t\t<LocaleProvider locale="${PATTERNS.locale}">\n`,
    `\t\t\t<Origin${PATTERNS.routeType} {...props} />\n`,
    "\t\t</LocaleProvider>\n",
    "\t);\n}"
  )
  .trim();

const routeTypeTemplates: Record<Exclude<RouteType, "copy">, string> = {
  layout: layoutTemplate,
  template: baseTemplate,
  page: baseTemplate,
  default: baseTemplate,
  loading: withoutProps(baseTemplate),
  "not-found": withoutProps(baseTemplate),
  error: withUseClient(baseTemplate),
  sitemap: baseTemplate,
  icon: baseTemplate,
  "apple-icon": baseTemplate,
  "opengraph-image": baseTemplate,
  "twitter-image": baseTemplate,
};

export function getTemplateCompiler(config: Config, originRoute: OriginRoute) {
  if (originRoute.type === "copy") return () => "";
  const originPath = path.join(config.originDir, originRoute.path);
  const contents = readFileSync(originPath).toString();
  let template = routeTypeTemplates[originRoute.type];
  template = withReExport(template, contents, "metadata");
  template = withReExport(template, contents, "viewport");
  template = withLocaleInjectedFn(template, contents, "generateMetadata");
  template = withLocaleInjectedFn(template, contents, "generateViewport");
  template = withLocaleInjectedFn(template, contents, "generateStaticParams");
  template = withLocaleInjectedFn(template, contents, "generateSitemaps");
  template = withLocaleInjectedFn(template, contents, "generateImageMetadata");
  template = withRouteSegmentConfig(template, contents);
  return (params: Record<PatternKey, string>) => {
    return PATTERN_KEYS.reduce(
      (compiled, key) => compiled.replaceAll(PATTERNS[key], params[key]),
      template
    );
  };
}

function withoutProps(template: string) {
  return template.replace(" {...props}", "").replace("props", "");
}

function withUseClient(template: string) {
  return template.replace(
    "// @ts-nocheck\n\n",
    '// @ts-nocheck\n\n"use client"\n\n'
  );
}

function withReExport(template: string, originContents: string, name: string) {
  const regExp = new RegExp(`export const ${name}`);
  if (!regExp.test(originContents)) return template;
  return template.concat(
    `\n\nexport { ${name} } from "${PATTERNS.relativePath}";`
  );
}

function withLocaleInjectedFn(
  template: string,
  originContents: string,
  fnName: string
) {
  const regExp = new RegExp(`export ((async )?function|const) ${fnName}`);
  if (!regExp.test(originContents)) return template;
  const additionalParams = fnName === "generateMetadata" ? ", parent" : "";
  return template.concat(
    `\n\nimport { ${fnName} as ${fnName}Origin } from "${PATTERNS.relativePath}";`,
    `\n\nexport function ${fnName}(props${additionalParams}) {`,
    `\n\treturn ${fnName}Origin({ ...props, locale: "${PATTERNS.locale}" }${additionalParams});\n}`
  );
}

const routeSegmentConfigs = [
  "experimental_ppr",
  "dynamic",
  "dynamicParams",
  "revalidate",
  "fetchCache",
  "runtime",
  "preferredRegion",
  "maxDuration",
  "alt",
  "size",
  "contentType",
];

function withRouteSegmentConfig(template: string, originContents: string) {
  let configs = "";
  routeSegmentConfigs.forEach((key) => {
    const regExp = new RegExp(`export const ${key} = .*`);
    const match = originContents.match(regExp);
    if (!match) return;
    const config = match[0];
    configs = configs.concat(`${config}\n`);
  });
  if (configs === "") return template;
  return template.concat("\n\n", configs.trim());
}
