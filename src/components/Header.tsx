import { Box, Flex, Text } from "@twilio-paste/core/";
import { ProductConversationsIcon } from "@twilio-paste/icons/esm/ProductConversationsIcon";

export default function Header() {
  return (
    <Box
      display="flex"
      alignItems="normal"
      backgroundColor="colorBackgroundPrimaryStrongest"
      color="colorTextBrandInverse"
      padding="space40"
      height="75px"
    >
      <Flex vAlignContent="center" paddingLeft="space50">
        <ProductConversationsIcon
          size="sizeIcon80"
          display="inline-block"
          decorative={true}
          title="Vestlus"
        />
        <Text
          as="span"
          color="colorTextBrandInverse"
          fontSize="fontSize50"
          fontWeight="fontWeightBold"
          marginLeft="space30"
        >
          Vestlus
        </Text>
      </Flex>
    </Box>
  );
}
