"use strict";

const files = require("../fixtures/files");
const check = require("../fixtures/check");
const chaiExec = require("chai-exec");

describe("bump --attribute", () => {

  it("should apply the version bump to the correct attribute", () => {
    files.create("package.json", { bananas: "" });
    files.create("bower.json", { bananas: null });
    files.create("component.json", { bananas: 0 });

    let bump = chaiExec("--major --attribute bananas");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.0.0\n` +
      `${check} Updated bower.json to 1.0.0\n` +
      `${check} Updated component.json to 1.0.0\n`
    );

    files.json("package.json").should.deep.equal({ bananas: "1.0.0" });
    files.json("bower.json").should.deep.equal({ bananas: "1.0.0" });
    files.json("component.json").should.deep.equal({ bananas: "1.0.0" });
  });

  it("should respect the previous value of the attribute", () => {
    files.create("package.json", { grapes: "1.2.3" });

    let bump = chaiExec("--minor --attribute grapes");

    bump.stderr.should.be.empty;
    bump.should.have.exitCode(0);

    bump.should.have.stdout(
      `${check} Updated package.json to 1.3.0\n`
    );

    files.json("package.json").should.deep.equal({ grapes: "1.3.0" });
  });
});
