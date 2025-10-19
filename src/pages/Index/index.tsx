import React, { memo, Suspense } from "react";

import Counter from "@/features/counter";
import DocList from "@/features/doc-list";
import logo from "@/shared/assets/logo.svg";
import { Input } from "@/shared/ui";
import Box from "@/shared/ui/Box";
import Spinner from "@/shared/ui/Spinner";
import { Table } from "@/shared/ui/Table";
import styles from "@/widgets/Layout/Layout.module.css";

interface Props {}

const sampleColumns = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "age",
    title: "Age",
  },
  {
    key: "address",
    title: "Address",
  },
];

const sampleData = [
  {
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

const Index: React.FC<Props> = memo(() => {
  const apiKey = process.env.REACT_APP_TEXT;
  return (
    <>
      <Box>
        <h1 className={styles.h1}>{apiKey}</h1>
        <img src={logo} alt="react-logo" className="react-logo" />
      </Box>
      <Input></Input>
      <Box>
        <Counter />
      </Box>
      <Box>
        <Suspense fallback={<Spinner size="xl" />}>
          <DocList />
        </Suspense>
      </Box>
      <Box>
        <Table columns={sampleColumns} data={sampleData} />
      </Box>
    </>
  );
});
Index.displayName = "Index";

export default Index;
