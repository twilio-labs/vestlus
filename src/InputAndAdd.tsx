import React, { useState } from "react";
import { Box, Label, Input, Button, Flex } from "@twilio-paste/core/";

export default function InputAndAdd({
  label = "Item",
  placeholder = "",
  button = "Add",
  onAdd,
}: {
  label?: string;
  placeholder?: string;
  button?: React.ReactNode;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleClick = () => {
    onAdd(value);
    setValue("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  return (
    <>
      <Box>
        <Label htmlFor="item">{label}</Label>
      </Box>
      <Box>
        <Flex>
          <Input
            aria-describedby="item_help_text"
            id="item"
            type="text"
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            value={value}
            placeholder={placeholder}
            required
          />
          &nbsp;
          <Button variant="primary" onClick={handleClick}>
            {button}
          </Button>
        </Flex>
      </Box>
    </>
  );
}
