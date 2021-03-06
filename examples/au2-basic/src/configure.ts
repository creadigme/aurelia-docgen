import { Aurelia, Registration } from "aurelia";
import { Au2Button } from "./components/au2-button";
import { Au2Countdown } from "./components/au2-countdown";
import { Au2Empty } from "./components/au2-empty";
import { MyApp } from "./my-app";
import { IMyService, MyService } from "./services/my-service";

/** It's just an example */
let au: Aurelia;

/**
 * If specified, this function is called to retrieve the instance of Aurelia
 * @return Aurelia
 */
export async function getOrCreateAurelia(): Promise<Aurelia> {
  if (!au) {
    au = new Aurelia().register(Registration.singleton(IMyService, MyService), MyApp, Au2Button, Au2Countdown, Au2Empty);
    // Do your specific stuff here
  }
  return au;
}
