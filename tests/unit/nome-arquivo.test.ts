// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  lerNomeArquivo,
  canonizar,
  categoriaDoNome,
} from "../../lib/import/nome-arquivo";

/**
 * O nome do arquivo é a única fonte de nome e preço do lote Imagensnovas
 * (ADR-0025). Errar aqui = peça com preço errado no ar.
 */
describe("lerNomeArquivo", () => {
  it("lê código, nome e preço do padrão da Ellen", () => {
    const r = lerNomeArquivo("EAL 456 Colar pedra natural azul com medalha $64,90");
    expect(r).not.toBeNull();
    expect(r!.codigo).toBe("EAL 456");
    expect(r!.nome).toBe("Colar pedra natural azul com medalha");
    expect(r!.precoCents).toBe(6490);
  });

  it("aceita espaço depois do cifrão", () => {
    expect(lerNomeArquivo("EAL 8614 Colar contas coral $ 59,90")!.precoCents).toBe(5990);
  });

  it("aceita código de 4 letras e número longo", () => {
    const r = lerNomeArquivo("EPK 12275 Conjunto gota semijoia duo banho $149,90");
    expect(r!.codigo).toBe("EPK 12275");
    expect(r!.precoCents).toBe(14990);
  });

  it("ignora sufixo de cópia (1) e underscore final", () => {
    const a = lerNomeArquivo("ABJ 350 Colar corrente grossa com pingentes $89,90(1)");
    const b = lerNomeArquivo("ABJ 350 Colar corrente grossa com pingentes $89,90");
    expect(a!.precoCents).toBe(8990);
    expect(a!.chave).toBe(b!.chave);
    expect(lerNomeArquivo("EPB  002 Choker semijoia olho grego_")!.nome).toBe(
      "Choker semijoia olho grego",
    );
  });

  it("devolve preço null quando o arquivo não tem preço", () => {
    const r = lerNomeArquivo("ETU 9676 Brinco aço com perola");
    expect(r!.precoCents).toBeNull();
    expect(r!.nome).toBe("Brinco aço com pérola");
  });

  it("corrige os erros de digitação recorrentes", () => {
    expect(lerNomeArquivo("EAL 382 Coloar corrente com pingente coração $79,90")!.nome).toBe(
      "Colar corrente com pingente coração",
    );
    expect(
      lerNomeArquivo("EPK 17541 Trio semijoia crajevado colorido bolinhas $49,90")!.nome,
    ).toContain("cravejado");
  });

  it("recusa nome fora do padrão (UUID do Drive)", () => {
    expect(lerNomeArquivo("A44FDD84-4813-4A40-95AD-189050EC4A5C")).toBeNull();
    expect(lerNomeArquivo("41")).toBeNull();
  });

  it("lê preço sem cifrão e com sufixo digitado por engano", () => {
    const r = lerNomeArquivo(
      "EAL 821 Colar Sorte duplo com cristais e cordinha natural 49,90st",
    );
    expect(r!.precoCents).toBe(4990);
    expect(r!.nome).toBe("Colar Sorte duplo com cristais e cordinha natural");
  });

  it("lê preço com cifrão E sufixo grudado ($49,90st)", () => {
    const r = lerNomeArquivo(
      "EAL 821 Colar Sorte duplo com cristais e cordinha natural $49,90st",
    );
    expect(r!.precoCents).toBe(4990);
    expect(r!.nome).toBe("Colar Sorte duplo com cristais e cordinha natural");
  });

  it("tira o prefixo de linha do nome da peça", () => {
    const r = lerNomeArquivo("EPK 12512 LINHA FESTA  Choker semijoia cravejado");
    expect(r!.nome).toBe("Choker semijoia cravejado");
  });
});

describe("agrupamento por chave", () => {
  it("mesma peça escrita com plural diferente cai na mesma chave", () => {
    const a = lerNomeArquivo("BFE 544 Colar cascalho coral com pingentes alga $59,90");
    const b = lerNomeArquivo("BFE 544 Colar cascalho coral com pingente algas $59,90");
    expect(a!.chave).toBe(b!.chave);
  });

  it("cores diferentes do MESMO código são peças diferentes", () => {
    const azul = lerNomeArquivo("EAL 456 Colar pedra natural azul com medalha $64,90");
    const verde = lerNomeArquivo("EAL 456 Colar pedra natural verde com medalha $64,90");
    expect(azul!.chave).not.toBe(verde!.chave);
  });

  it("canonizar tira acento, caixa e plural", () => {
    expect(canonizar("Colar Pérolas Grandes")).toBe("colar perola grande");
  });

  it("mesma peça com as palavras em outra ordem é a mesma peça", () => {
    // a Ellen digita "argola grossa prateado" numa foto e "prateado argola
    // grossa" na outra — é o mesmo brinco
    const a = lerNomeArquivo("ESH 1086 Brinco argola grossa prateado $29,90");
    const b = lerNomeArquivo("ESH 1086 Brinco prateado argola grossa");
    expect(a!.chave).toBe(b!.chave);
  });

  it("mas cor diferente continua sendo peça diferente", () => {
    const azul = lerNomeArquivo("EAL 456 Colar pedra natural azul com medalha $64,90");
    const bordo = lerNomeArquivo("EAL 456 Colar pedra natural bordo com medalha $64,90");
    expect(azul!.chave).not.toBe(bordo!.chave);
  });
});

describe("categoriaDoNome", () => {
  it("classifica pelo tipo da peça, não pela cor", () => {
    expect(categoriaDoNome("Colar pedra natural azul")).toBe("colares");
    expect(categoriaDoNome("Cordão com medalha")).toBe("colares");
    expect(categoriaDoNome("Pulseira couro com correntes")).toBe("pulseiras");
    expect(categoriaDoNome("Brinco resina marrom")).toBe("brincos");
    expect(categoriaDoNome("Conjunto gota semijoia")).toBe("conjuntos");
  });

  it("choker é colar (ADR-0025)", () => {
    expect(categoriaDoNome("Choker semijoia olho grego")).toBe("colares");
  });

  it("trio é brinco — no lote da Ellen todo trio é de brincos/argolas", () => {
    expect(categoriaDoNome("Trio semijoia bolinhas")).toBe("brincos");
    expect(categoriaDoNome("Trio brincos argolas aço")).toBe("brincos");
    expect(categoriaDoNome("Trio argolas aço trabalhado")).toBe("brincos");
  });
});
