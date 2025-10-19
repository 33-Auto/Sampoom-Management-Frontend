import React, { memo } from "react";

import { Select } from "@/shared/ui";

interface Props {}

const Example: React.FC<Props> = memo(() => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];
  return (
    <>
      <Select label="테스트" options={options} />
    </>
  );
});
Example.displayName = "Example";

export default Example;
