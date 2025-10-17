import axios from "axios";

export async function getItems() {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/part");
        console.log("여기되나?");
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
