import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Aside } from "../components/Aside";

// Component Unit test
describe("Aside component", () => {
    it("display the aside correctly", () => {
        render(
            <Aside 
                onOpenForm={vi.fn()}
                disabled={false}
            />
        )

        expect(screen.getByRole("heading", { name: /Conversations & Threads/i })).toBeInTheDocument();
        expect(screen.getByText(/Try Now !/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Add Message/i })).toBeInTheDocument();
    })

    it("disable the button when disabled is true", () => {
        render(
            <Aside 
                onOpenForm={() => vi.fn()}
                disabled={true}
            />
        )

        expect(screen.getByRole("button", { name: /Add Message/i })).toBeDisabled();
    })
})