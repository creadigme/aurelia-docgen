import type { IContainer } from "aurelia";
import { Au2Button } from "./components/au2-button";
import { Au2Countdown } from "./components/au2-countdown";
import { Au2Empty } from "./components/au2-empty";
import { MyApp } from "./my-app";

export function register(container: IContainer): IContainer {
  return container.register(MyApp, Au2Button, Au2Countdown, Au2Empty);
}
