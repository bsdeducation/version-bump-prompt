"use strict";

const mocks = require("../fixtures/mocks");
const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chaiExec = require("chai-exec");

describe("bump --commit", () => {

  it("should commit the manifest file to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--major --commit");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 2.0.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit package.json -m "release v2.0.0"');
  });

  it("should commit multiple manifest files to git", () => {
    files.create("package.json", { version: "1.0.0" });
    files.create("bower.json", { version: "1.0.0" });
    files.create("component.json", { version: "1.0.0" });

    let bump = chaiExec("--minor --commit");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Updated bower.json to 1.1.0\n` +
      `${check} Updated component.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit package.json bower.json component.json -m "release v1.1.0"');
  });

  it("should commit all files to git", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--minor --commit --all");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit -a -m "release v1.1.0"');
  });

  it("should commit without running pre-commit hooks", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--minor --commit --all --no-verify");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.1.0\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit --no-verify -a -m "release v1.1.0"');
  });

  it("should commit the manifest files to git with a message", () => {
    files.create("package.json", { version: "1.0.0" });

    let bump = chaiExec("--patch --all --commit my-message");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.0.1\n` +
      `${check} Git commit\n`
    );

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit -a -m "v1.0.1 my-message"');
  });

});
