import React from "react";

import { action } from "@storybook/addon-actions";
import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import { HistoryModal } from "../History";

const history = [
  {
    id: "5ccaec7275dbbc092cb9029b",
    author: "Test@axa.fr",
    type: "technology",
    elementId: "5823926b69170e15d895fda0",
    entityId: null,
    // tslint:disable-next-line: max-line-length
    diff:
      "{\r\n  'Id': [\r\n    '5823926b69170e15d895fda0'\r\n  ],\r\n  'Version': [\r\n    0\r\n  ],\r\n  'Name': [\r\n    'Solution de parametrage'\r\n  ],\r\n  'Key': [\r\n    'solution-de-parametrage'\r\n  ],\r\n  'Category': [\r\n    'tools'\r\n  ],\r\n  'Description': [\r\n    'test'\r\n  ],\r\n  'Scope': [\r\n    'qqqq'\r\n  ],\r\n  'Reporter': [\r\n    null\r\n  ],\r\n  'UpdateDate': [\r\n    '2019-03-01T14:21:38.374Z'\r\n  ]\r\n}",
    updateDate: null
  }
];

storiesOf("SideModal", module)
  .addDecorator(withKnobs)
  .add("History modal", () => (
    <HistoryModal
      history={history}
      loading={boolean("loading", false)}
      isOpen={boolean("isOpen", true)}
      onClose={action("onClose")}
      onToggle={action("onToggle")}
      title={text("title", "title")}
      idToOpen={text("idToOpen", "idToOpen")}
    />
  ));
