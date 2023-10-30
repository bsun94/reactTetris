import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  const result = render(<App />);
  const linkElement = result.container.querySelector("#board");
  expect(linkElement).toBeInTheDocument();
});
