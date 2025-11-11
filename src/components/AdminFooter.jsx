import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;

function AdminFooter() {
  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        PositiveMilk ©{new Date().getFullYear()} Created by{" "}
        <a href="https://www.teknikoglobal.com/">Tekniko Global</a>
      </Footer>
    </>
  );
}

export default AdminFooter;
