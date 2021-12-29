import React, { useState } from "react";
import { Box, Label, Input, HelpText, Button } from "@twilio-paste/core/";

export default function InputAndAdd({
  label = "Item",
  helpText = "Add an item.",
  button = "Add",
  onAdd,
}) {
  const [value, setValue] = useState("");

  const handleClick = () => {
    onAdd(value);
    setValue("");
  };

  return (
    <>
      <Box marginBottom="space60">
        <Label htmlFor="item" required>
          {label}
        </Label>
        <Input
          aria-describedby="item_help_text"
          id="item"
          type="text"
          onChange={(e) => setValue(e.currentTarget.value)}
          value={value}
          required
        />
        <HelpText id="item_help_text">{helpText}</HelpText>
      </Box>
      <Button variant="primary" onClick={handleClick}>
        {button}
      </Button>
    </>
  );
}
