import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GradeOrdenavel } from "../../app/admin/_components/GradeOrdenavel";

/**
 * O arraste com o dedo só existe de verdade num navegador de verdade (jsdom
 * não tem PointerEvent nem layout), e está coberto pelo teste de ponta a ponta.
 * Aqui fica o que o jsdom sabe julgar: o caminho por teclado — que é o mesmo
 * `moverItem` — e a promessa de que a lista recebida nunca é mutada.
 */
function montar(onReordenar = vi.fn()) {
  render(
    <GradeOrdenavel
      ids={["colar", "brinco", "pulseira"]}
      onReordenar={onReordenar}
      rotuloItem={(id) => `Peça ${id}`}
      renderItem={(id, i) => (
        <span>
          {i + 1} {id}
        </span>
      )}
    />,
  );
  return onReordenar;
}

describe("GradeOrdenavel — reordenar sem arrastar (ADR-0031)", () => {
  it("a seta para a direita empurra a peça uma casa adiante", async () => {
    const onReordenar = montar();
    const user = userEvent.setup();
    await user.tab(); // foca a primeira foto
    await user.keyboard("{ArrowRight}");
    expect(onReordenar).toHaveBeenCalledWith(["brinco", "colar", "pulseira"]);
  });

  it("a seta para a esquerda traz a peça uma casa atrás", async () => {
    const onReordenar = montar();
    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    await user.tab(); // terceira foto
    await user.keyboard("{ArrowLeft}");
    expect(onReordenar).toHaveBeenCalledWith(["colar", "pulseira", "brinco"]);
  });

  it("na ponta da lista a seta não faz nada — nada some", async () => {
    const onReordenar = montar();
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(onReordenar).not.toHaveBeenCalled();
  });

  it("toda foto é alcançável pelo teclado e diz sua posição", () => {
    montar();
    expect(
      screen.getByLabelText(/Peça colar — posicao 1 de 3/),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Peça pulseira — posicao 3 de 3/),
    ).toBeInTheDocument();
  });
});
