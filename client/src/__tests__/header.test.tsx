import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import { MemoryRouter } from "react-router-dom";

// Header Component Unit test
describe("Header component", () => {
    it("display the header correctly", () => {
        render(
            <MemoryRouter>
                <Header 
                    isLoginDisplay={true}
                />
            </MemoryRouter>
        )

        expect(screen.getByText(/Message board/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
    })
})

// Because we use Link in the component we wrap into memoryRouter