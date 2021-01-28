import {
  TemplateVarAst,
  TemplateVarsFeature,
  TemplateVarToken,
} from "./template-vars";

describe("TemplateVarsFeature.parseTerm", () => {
  const feature = new TemplateVarsFeature();

  it("should match a TemplateVarToken", () => {
    expect(feature.parseTerm([TemplateVarToken.of("foo")])).toEqual({
      ast: new TemplateVarAst("foo"),
      consumed: 1,
    });
  });
});
