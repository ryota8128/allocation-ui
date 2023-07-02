import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import FormAddAccount from "@/components/account/FormAddAccount";
import { Button } from "reactstrap";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main>
        <div style={{ margin: 50 }}>
          <h4 style={{ marginBottom: 20, textAlign: "center" }}>
            追加する講座情報を入力してください
          </h4>
          <FormAddAccount />
        </div>
      </main>
    </>
  );
}
