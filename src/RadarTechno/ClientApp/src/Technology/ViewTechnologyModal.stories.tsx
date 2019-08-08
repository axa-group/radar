import React from "react";

import { action } from "@storybook/addon-actions";
import { boolean, object, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import { ViewTechnologyModal } from "../Technology/ViewTechnologyModal";
import { ITechnology } from "./Technology";

const technology: ITechnology = {
  updateDate: null,
  id: "5823926b69170e15d895fda0",
  version: 0,
  category: "tools",
  name: "Solution de parametrage",
  key: "solution-de-parametrage",
  scope: "scope",
  description: "description",
  entitiesStatus: [
    { entityId: "1", entityName: "AXA France", status: "assess" },
    { entityId: "2", entityName: "AXA UK", status: "reinforce" }
  ],
  groupStatus: "reinforce"
};

storiesOf("Technologies", module)
  .addDecorator(withKnobs)
  .add("View technology modal", () => (
    <ViewTechnologyModal
      item={object("technology", technology)}
      isOpen={boolean("isOpen", true)}
      onClose={action("onClose")}
    />
  ));
