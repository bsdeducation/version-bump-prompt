"use strict";

const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chaiExec = require("chai-exec");

describe("bump --minor", () => {
  it("should not increment a non-existent version number", () => {
    files.create("package.json", {});
    files.create("bower.json", { name: "my-app" });

    let bump = chaiExec("--minor");

    bump.stderr.should.be.empty;
    bump.stdout.should.be.empty;
    bump.should.have.exitCode(0);

    files.json("package.json").should.deep.equal({});
    files.json("bower.json").should.deep.equal({ name: "my-app" });
  });

  it("should treat empty version numbers as 0.0.0", () => {
    files.create("package.json", { version: "" });
    files.create("bower.json", { version: null });
    files.create("component.json", { version: 0 });

    let bump = chaiExec("--minor");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 0.1.0\n` +
      `${check} Updated bower.json to 0.1.0\n` +
      `${check} Updated component.json to 0.1.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "0.1.0" });
    files.json("bower.json").should.deep.equal({ version: "0.1.0" });
    files.json("component.json").should.deep.equal({ version: "0.1.0" });
  });

  it("should increment an all-zero version number", () => {
    files.create("package.json", { version: "0.0.0" });

    let bump = chaiExec("--minor");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 0.1.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "0.1.0" });
  });

  it("should reset the patch", () => {
    files.create("package.json", { version: "1.2.3" });

    let bump = chaiExec("--minor");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.3.0" });
  });

  it("should reset the prerelease version", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let bump = chaiExec("--minor");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.3.0" });
  });

  it("should not be affected by the --preid flag", () => {
    files.create("package.json", { version: "1.2.3-beta.4" });

    let bump = chaiExec("--minor --preid alpha");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    files.json("package.json").should.deep.equal({ version: "1.3.0" });
  });
});
