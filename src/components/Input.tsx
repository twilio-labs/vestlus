import {
  Box,
  HelpText,
  Input as BaseInput,
  InputBoxTypes,
  Label,
} from "@twilio-paste/core/";

export default function Input({
  type = "text",
  value = "",
  label,
  placeholder,
  onChange = () => {},
  onEnter = () => {},
  error = false,
}: {
  type?: InputBoxTypes;
  value?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  error: boolean | string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.currentTarget.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <Box paddingBottom="space40">
      {label && <Label>{label}</Label>}
      <BaseInput
        type={type}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        value={value}
        hasError={!!error}
      />
      {!!error && <HelpText variant="error">{error} </HelpText>}
    </Box>
  );
}
