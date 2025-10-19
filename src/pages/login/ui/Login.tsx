import { Button, Table } from "@/shared/ui";

export default function Login() {
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-avocado-300 mb-8 flex w-[440px] flex-col items-center gap-1 rounded-lg p-6 shadow-md">
        <Button>로그인</Button>
        <Button variant="destructive">로그인</Button>
        <Button variant="secondary">로그인</Button>
        <Button variant="ghost">로그인</Button>
        <Button variant="outline">로그인</Button>
      </div>

      <Table columns={sampleColumns} data={sampleData} />
    </div>
  );
}
