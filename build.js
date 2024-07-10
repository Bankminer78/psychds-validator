import { build, emptyDir } from "@deno/dnt";

//await emptyDir("./npm");

await build({
  entryPoints: ["./src/psychds-validator.ts"],
  outDir: "./npm",
  scriptModule: false,
  shims: {
    deno: true,
  },
  package: {
    name: "PsychDSValidator",
    version: Deno.args[0],
    description: "Your package.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/psych-ds/psychds-validator.git",
    },
    bugs: {
      url: "https://github.com/username/repo/issues",
    },
  }
});
