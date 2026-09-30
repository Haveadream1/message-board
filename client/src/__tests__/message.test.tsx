import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Message from "../components/Message";

// Message Component Unit test
describe("Message component", () => {
    it("display the message correctly", () => {
        render(
            <Message 
                username="User23"
                message="Hi!"
                date="02/12/2026"
                likeCount={1}
                isDeleteVisible={true}
                isMessageLiked={false}
                onLikeClick={vi.fn()}
                onDeleteClick={vi.fn()}
            />
        )

        expect(screen.getByText(/User23/i)).toBeInTheDocument();
        expect(screen.getByText(/Hi!/i)).toBeInTheDocument();
        expect(screen.getByTestId("delete-btn")).toBeTruthy();
    })

    it("display the liked icon on message", () => {
        render(
            <Message 
                username="User23"
                message="Hi!"
                date="02/12/2026"
                likeCount={1}
                isDeleteVisible={true}
                isMessageLiked={true}
                onLikeClick={vi.fn()}
                onDeleteClick={vi.fn()}
            />
        )
        // If the image icon with the following is in the screen, means the function works
        expect(screen.getByTestId("filled-like")).toBeTruthy();
    })
})